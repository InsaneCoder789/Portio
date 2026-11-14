/*
 * Drawing kit for the opening scene. Every function draws one thing, in the units of the scene
 * (roughly: a rowing boat is 420 wide), and takes the time as an argument, so any moment can be
 * redrawn exactly. Nothing here keeps state.
 */

export type Ctx = CanvasRenderingContext2D;
export type V = [number, number];
export type RGB = [number, number, number];

export const TAU = Math.PI * 2;
export const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const smooth = (v: number) => { const k = clamp(v); return k * k * (3 - 2 * k); };
export const ease = (v: number) => 1 - Math.pow(1 - clamp(v), 3);
export const hash = (n: number) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
export const dir = (a: number): V => [Math.sin(a), -Math.cos(a)];

export const hex = (value: string): RGB => {
  const v = value.replace("#", "");
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
};
export const mixRGB = (a: RGB, b: RGB, k: number): RGB => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
export const css = (c: RGB, alpha = 1) => `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${alpha})`;

/* ---------------------------------------------------------------- sea colour by depth */

const RAMP: [number, RGB][] = ([
  [0, [46, 214, 206]],
  [120, [20, 176, 204]],
  [380, [10, 124, 178]],
  [700, [8, 82, 142]],
  [1050, [6, 46, 98]],
  [1350, [3, 22, 52]],
  [1700, [1, 8, 22]],
] as [number, RGB][]).map(([d, col]) => [d * 1.45, col]);
export const seaColour = (depth: number): RGB => {
  if (depth <= RAMP[0][0]) return RAMP[0][1];
  for (let i = 1; i < RAMP.length; i++) {
    if (depth <= RAMP[i][0]) {
      const [d0, c0] = RAMP[i - 1], [d1, c1] = RAMP[i];
      return mixRGB(c0, c1, (depth - d0) / (d1 - d0));
    }
  }
  return RAMP[RAMP.length - 1][1];
};
export const RAMP_STOPS = RAMP;

/* ---------------------------------------------------------------- two-bone reach */

// Where the middle joint goes when a limb of two bones has to reach a point. `bend` picks the side.
export function reach(ax: number, ay: number, tx: number, ty: number, l1: number, l2: number, bend: 1 | -1): { mid: V; end: V } {
  let dx = tx - ax, dy = ty - ay;
  const full = Math.hypot(dx, dy) || 0.001;
  const d = clamp(full, Math.abs(l1 - l2) + 0.5, l1 + l2 - 0.4);
  const base = Math.atan2(dy, dx);
  const a = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
  const m = base + bend * a;
  const mid: V = [ax + Math.cos(m) * l1, ay + Math.sin(m) * l1];
  dx = (dx / full) * d; dy = (dy / full) * d;
  return { mid, end: [ax + dx, ay + dy] };
}

/* ---------------------------------------------------------------- people */

export type Look = {
  skin: string; skinDark: string; hair: string; top: string; bottom: string; trim: string;
  hat?: boolean; mask?: boolean; sleeves?: boolean; shirtStripe?: string;
};
export type Joints = {
  hip: V; sh: V; headC: V; headAng: number; facing: 1 | -1;
  elL: V; haL: V; elR: V; haR: V; knL: V; foL: V; knR: V; foR: V; toeL: V; toeR: V;
};
export type Pose = {
  x: number; y: number; torso: number; head: number;
  lu: number; lf: number; ru: number; rf: number; lt: number; ls: number; rt: number; rs: number;
  facing?: 1 | -1; pointed?: number;
};

const L = { torso: 46, neck: 7, head: 11, upper: 26, fore: 24, thigh: 31, shin: 30, foot: 11 };
export const LIMB = L;

export function fk(p: Pose): Joints {
  const add = (o: V, a: number, len: number): V => { const d = dir(a); return [o[0] + d[0] * len, o[1] + d[1] * len]; };
  const hip: V = [p.x, p.y];
  const sh = add(hip, p.torso, L.torso);
  const ha = p.torso + p.head;
  const headC = add(sh, ha, L.neck + L.head);
  const elL = add(sh, p.lu, L.upper), haL = add(elL, p.lf, L.fore);
  const elR = add(sh, p.ru, L.upper), haR = add(elR, p.rf, L.fore);
  const knL = add(hip, p.lt, L.thigh), foL = add(knL, p.ls, L.shin);
  const knR = add(hip, p.rt, L.thigh), foR = add(knR, p.rs, L.shin);
  const k = p.pointed ?? 0;
  const toe = (ank: V, sa: number): V => add(ank, lerp(sa - Math.PI / 2, sa, k) * 1, L.foot);
  return { hip, sh, headC, headAng: ha, facing: p.facing ?? 1, elL, haL, elR, haR, knL, foL, knR, foR, toeL: toe(foL, p.ls), toeR: toe(foR, p.rs) };
}

const seg = (c: Ctx, a: V, b: V, w: number, col: string) => {
  c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round";
  c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke();
};
const part = (a: V, b: V, k: number): V => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];

// `tint` blends every colour towards the water, so a swimmer sinks into the blue.
export function person(c: Ctx, j: Joints, look: Look, tint = 0, water: RGB = [10, 120, 170]) {
  const col = (h: string) => css(mixRGB(hex(h), water, tint));
  const skin = col(look.skin), skinDark = col(look.skinDark), top = col(look.top), bottom = col(look.bottom), trim = col(look.trim);
  const limb = (a: V, b: V, w: number, c1: string) => seg(c, a, b, w, c1);

  // the far side first
  limb(j.sh, j.elL, 8, look.sleeves ? top : skinDark); limb(j.elL, j.haL, 7, skinDark);
  limb(j.hip, part(j.hip, j.knL, 0.62), 13, bottom); limb(part(j.hip, j.knL, 0.55), j.knL, 10.5, skinDark); limb(j.knL, j.foL, 9, skinDark); limb(j.foL, j.toeL, 6.5, skinDark);

  // torso, with a waistband and a collar line
  seg(c, j.hip, j.sh, 21, top);
  if (look.shirtStripe) {
    c.save();
    for (let i = 1; i < 5; i++) { const q = part(j.hip, j.sh, i / 5); const n: V = [Math.cos(j.headAng), Math.sin(j.headAng)]; seg(c, [q[0] - n[0] * 10, q[1] - n[1] * 10], [q[0] + n[0] * 10, q[1] + n[1] * 10], 3, col(look.shirtStripe)); }
    c.restore();
  }
  seg(c, j.hip, part(j.hip, j.sh, 0.2), 22, bottom);
  seg(c, part(j.hip, j.sh, 0.2), part(j.hip, j.sh, 0.26), 22.5, trim);
  seg(c, j.sh, part(j.sh, j.headC, 0.5), 7.5, skin);

  // the near side
  limb(j.hip, part(j.hip, j.knR, 0.62), 14, bottom); limb(part(j.hip, j.knR, 0.55), j.knR, 11.5, skin); limb(j.knR, j.foR, 9.5, skin); limb(j.foR, j.toeR, 7, skin);
  limb(j.sh, j.elR, 9, look.sleeves ? top : skin); limb(j.elR, j.haR, 7.5, skin);
  c.fillStyle = skin; c.beginPath(); c.arc(j.haR[0], j.haR[1], 4.2, 0, TAU); c.fill();
  c.fillStyle = skinDark; c.beginPath(); c.arc(j.haL[0], j.haL[1], 3.8, 0, TAU); c.fill();

  // head
  const ax: V = dir(j.headAng), fr: V = dir(j.headAng + (j.facing * Math.PI) / 2);
  c.fillStyle = col(look.hair); c.beginPath(); c.arc(j.headC[0], j.headC[1], 11.6, 0, TAU); c.fill();
  c.fillStyle = skin; c.beginPath(); c.arc(j.headC[0] + fr[0] * 3.4 - ax[0] * 1.2, j.headC[1] + fr[1] * 3.4 - ax[1] * 1.2, 9, 0, TAU); c.fill();
  c.fillStyle = skinDark; c.beginPath(); c.arc(j.headC[0] + fr[0] * 11 - ax[0] * 0.5, j.headC[1] + fr[1] * 11 - ax[1] * 0.5, 1.8, 0, TAU); c.fill();
  if (look.mask) {
    const lens: V = [j.headC[0] + fr[0] * 7 + ax[0] * 2, j.headC[1] + fr[1] * 7 + ax[1] * 2];
    c.strokeStyle = col("#1b2a3a"); c.lineWidth = 2.2; c.beginPath();
    c.moveTo(lens[0] - fr[0] * 7 - ax[0] * 0.5, lens[1] - fr[1] * 7 - ax[1] * 0.5); c.lineTo(j.headC[0] - fr[0] * 8, j.headC[1] - fr[1] * 8); c.stroke();
    c.fillStyle = css(mixRGB([150, 230, 255], water, tint), 0.85); c.strokeStyle = col("#ffb81c"); c.lineWidth = 2;
    c.beginPath(); c.ellipse(lens[0], lens[1], 4.2, 5.2, j.headAng, 0, TAU); c.fill(); c.stroke();
  }
  if (look.hat) {
    c.save(); c.translate(j.headC[0] + ax[0] * 8, j.headC[1] + ax[1] * 8); c.rotate(j.headAng);
    c.fillStyle = col("#e6c36a"); c.beginPath(); c.ellipse(0, 1, 21, 4.6, 0, 0, TAU); c.fill();
    c.fillStyle = col("#f0d58a"); c.beginPath(); c.ellipse(0, -4.5, 11.5, 9, 0, Math.PI, TAU); c.fill(); c.fillRect(-11.5, -4.5, 23, 5);
    c.fillStyle = col("#d3452f"); c.fillRect(-11.7, -2.6, 23.4, 3.2);
    c.strokeStyle = col("#b8923a"); c.lineWidth = 0.8; c.beginPath(); c.ellipse(0, 1, 17, 3.6, 0, 0.2, Math.PI - 0.2); c.stroke();
    c.restore();
  }
}

/* ---------------------------------------------------------------- sky */

export function cloud(c: Ctx, x: number, y: number, s: number, seed: number, light: string, shade: string, alpha: number) {
  c.save(); c.translate(x, y); c.scale(s, s); c.globalAlpha = alpha;
  const puffs = 7 + Math.floor(hash(seed) * 3);
  const px: number[] = [], py: number[] = [], pr: number[] = [];
  for (let i = 0; i < puffs; i++) {
    const f = i / (puffs - 1);
    px.push(-120 + f * 240 + (hash(seed + i) - 0.5) * 36);
    pr.push(26 + Math.sin(f * Math.PI) * 30 + hash(seed + i * 3) * 12);
    py.push(-Math.sin(f * Math.PI) * 18 - hash(seed + i * 5) * 10);
  }
  c.fillStyle = shade;
  for (let i = 0; i < puffs; i++) { c.beginPath(); c.ellipse(px[i], py[i] + 12, pr[i], pr[i] * 0.72, 0, 0, TAU); c.fill(); }
  c.fillStyle = light;
  for (let i = 0; i < puffs; i++) { c.beginPath(); c.ellipse(px[i] - 3, py[i] - 2, pr[i] * 0.92, pr[i] * 0.66, 0, 0, TAU); c.fill(); }
  // the sun-facing edge of each puff, and a soft shadow where they overlap
  c.fillStyle = "rgba(255,246,214,.6)";
  for (let i = 0; i < puffs; i++) { c.beginPath(); c.ellipse(px[i] + pr[i] * 0.2, py[i] - pr[i] * 0.24, pr[i] * 0.62, pr[i] * 0.4, 0.2, 0, TAU); c.fill(); }
  c.fillStyle = "rgba(150,190,225,.18)";
  for (let i = 1; i < puffs; i++) { c.beginPath(); c.ellipse(px[i] - pr[i] * 0.55, py[i] + pr[i] * 0.3, pr[i] * 0.4, pr[i] * 0.3, 0, 0, TAU); c.fill(); }
  c.restore();
}

export function gull(c: Ctx, x: number, y: number, s: number, t: number, phase: number) {
  const flap = Math.sin(t * 7 + phase) * 0.8;
  c.save(); c.translate(x, y); c.scale(s, s);
  c.strokeStyle = "#f6f9fb"; c.lineWidth = 2.6; c.lineCap = "round"; c.lineJoin = "round";
  c.beginPath(); c.moveTo(-26, -6 * flap - 2); c.quadraticCurveTo(-13, -13 * flap - 8, 0, 0); c.quadraticCurveTo(13, -13 * flap - 8, 26, -6 * flap - 2); c.stroke();
  c.strokeStyle = "rgba(60,90,110,.4)"; c.lineWidth = 1; c.beginPath(); c.moveTo(-24, -6 * flap); c.quadraticCurveTo(-12, -11 * flap - 5, 0, 2); c.stroke();
  c.restore();
}

export function sun(c: Ctx, x: number, y: number, r: number, t: number) {
  const halo = c.createRadialGradient(x, y, r * 0.4, x, y, r * 11);
  halo.addColorStop(0, "rgba(255,244,200,.95)"); halo.addColorStop(0.12, "rgba(255,226,150,.55)");
  halo.addColorStop(0.4, "rgba(255,190,110,.18)"); halo.addColorStop(1, "rgba(255,170,100,0)");
  c.fillStyle = halo; c.fillRect(x - r * 11, y - r * 11, r * 22, r * 22);
  c.save(); c.translate(x, y); c.rotate(t * 0.03);
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * TAU, len = r * (i % 2 ? 3.4 : 5.4) * (0.88 + 0.12 * Math.sin(t * 1.3 + i));
    const g = c.createLinearGradient(0, 0, Math.cos(a) * len, Math.sin(a) * len);
    g.addColorStop(0, "rgba(255,246,208,.5)"); g.addColorStop(1, "rgba(255,246,208,0)");
    c.fillStyle = g; c.beginPath(); c.moveTo(Math.cos(a - 0.05) * r, Math.sin(a - 0.05) * r); c.lineTo(Math.cos(a) * len, Math.sin(a) * len); c.lineTo(Math.cos(a + 0.05) * r, Math.sin(a + 0.05) * r); c.fill();
  }
  c.restore();
  const disc = c.createRadialGradient(x - r * 0.25, y - r * 0.25, r * 0.1, x, y, r);
  disc.addColorStop(0, "#ffffff"); disc.addColorStop(0.55, "#fff5c8"); disc.addColorStop(1, "#ffe08a");
  c.fillStyle = disc; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
}

/* ---------------------------------------------------------------- the island */

export function palm(c: Ctx, x: number, y: number, h: number, lean: number, t: number, seed: number, dark: string, mid: string) {
  const tx = x + lean * h, ty = y - h;
  c.strokeStyle = dark; c.lineCap = "round";
  c.lineWidth = Math.max(2, h * 0.07); c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + lean * h * 0.15, y - h * 0.6, tx, ty); c.stroke();
  c.strokeStyle = mid; c.lineWidth = Math.max(1, h * 0.03);
  for (let i = 0; i < 9; i++) {
    const a = -Math.PI + (i / 8) * Math.PI + (hash(seed + i) - 0.5) * 0.25;
    const len = h * (0.46 + hash(seed + i * 7) * 0.14), sway = Math.sin(t * 1.4 + i + seed) * 0.05;
    const ex = tx + Math.cos(a + sway) * len, ey = ty + Math.sin(a + sway) * len * 0.55 + len * 0.42;
    c.beginPath(); c.moveTo(tx, ty); c.quadraticCurveTo(tx + Math.cos(a) * len * 0.55, ty + Math.sin(a) * len * 0.75 - len * 0.18, ex, ey); c.stroke();
    // leaflets
    c.lineWidth = Math.max(0.8, h * 0.014);
    for (let k = 1; k <= 5; k++) {
      const f = k / 6, qx = lerp(tx, ex, f), qy = lerp(ty, ey, f) - Math.sin(f * Math.PI) * len * 0.16;
      c.beginPath(); c.moveTo(qx, qy); c.lineTo(qx + (Math.cos(a) > 0 ? 1 : -1) * len * 0.07, qy + len * 0.1); c.stroke();
    }
    c.lineWidth = Math.max(1, h * 0.03);
  }
  c.fillStyle = dark; c.beginPath(); c.arc(tx, ty + 2, Math.max(2, h * 0.04), 0, TAU); c.fill();
}

/* ---------------------------------------------------------------- the boat */

export function boatHull(c: Ctx, t: number) {
  // hull outline: sheer line rising to a high bow on the right
  const path = () => {
    c.beginPath();
    c.moveTo(-214, -40);
    c.quadraticCurveTo(-120, -22, 0, -24);
    c.quadraticCurveTo(130, -26, 214, -52);
    c.quadraticCurveTo(216, -6, 168, 16);
    c.quadraticCurveTo(60, 30, -90, 26);
    c.quadraticCurveTo(-170, 22, -204, -4);
    c.closePath();
  };
  c.save(); path();
  const body = c.createLinearGradient(0, -52, 0, 30);
  body.addColorStop(0, "#f2674a"); body.addColorStop(0.5, "#df4a34"); body.addColorStop(1, "#a82c22");
  c.fillStyle = body; c.fill(); c.clip();
  // white boot-stripe and the dark waterline band
  c.fillStyle = "#f6efe0"; c.beginPath(); c.moveTo(-230, -8); c.quadraticCurveTo(0, 8, 230, -26); c.lineTo(230, -17); c.quadraticCurveTo(0, 18, -230, 2); c.fill();
  c.fillStyle = "#17394a"; c.beginPath(); c.moveTo(-230, 12); c.quadraticCurveTo(0, 30, 230, -4); c.lineTo(230, 60); c.lineTo(-230, 60); c.fill();
  // planks
  c.strokeStyle = "rgba(90,18,10,.35)"; c.lineWidth = 1.3;
  for (const [o, w] of [[-14, 0.0], [2, 0.0]] as const) { c.beginPath(); c.moveTo(-220, -30 + o + w); c.quadraticCurveTo(0, -14 + o, 220, -42 + o); c.stroke(); }
  // wood grain, plank highlights and the row of fixings along the sheer
  for (let i = 0; i < 46; i++) {
    const gx = -200 + hash(i * 1.7) * 400, gy = -34 + hash(i * 3.1) * 56;
    c.strokeStyle = `rgba(80,14,8,${0.07 + hash(i) * 0.1})`; c.lineWidth = 0.8;
    c.beginPath(); c.moveTo(gx, gy); c.quadraticCurveTo(gx + 14, gy + (hash(i + 4) - 0.5) * 3, gx + 28 + hash(i + 8) * 24, gy + (hash(i + 2) - 0.5) * 4); c.stroke();
  }
  c.strokeStyle = "rgba(255,180,150,.28)"; c.lineWidth = 1;
  for (const o of [-13, 3]) { c.beginPath(); c.moveTo(-220, -29 + o); c.quadraticCurveTo(0, -13 + o, 220, -41 + o); c.stroke(); }
  c.fillStyle = "rgba(60,10,6,.55)";
  for (let x = -190; x <= 196; x += 17) { const y = -24 - (x + 190) * 0.0006 * 70 / 70 - Math.max(0, x - 80) * 0.18; c.beginPath(); c.arc(x, y + 6, 1.1, 0, TAU); c.fill(); }
  // sun on the planking
  const shine = c.createLinearGradient(-100, 0, 220, 0); shine.addColorStop(0, "rgba(255,255,255,0)"); shine.addColorStop(0.7, "rgba(255,230,190,.28)"); shine.addColorStop(1, "rgba(255,230,190,.06)");
  c.fillStyle = shine; c.fillRect(-230, -60, 460, 100);
  c.restore();
  // gunwale cap
  c.strokeStyle = "#f4e6c4"; c.lineWidth = 5; c.lineCap = "round";
  c.beginPath(); c.moveTo(-214, -40); c.quadraticCurveTo(-120, -22, 0, -24); c.quadraticCurveTo(130, -26, 214, -52); c.stroke();
  c.strokeStyle = "#b8935a"; c.lineWidth = 1.4; c.beginPath(); c.moveTo(-212, -37); c.quadraticCurveTo(-120, -19, 0, -21); c.quadraticCurveTo(130, -23, 212, -49); c.stroke();
  // bow stem, ring and name
  c.fillStyle = "#f4e6c4"; c.beginPath(); c.moveTo(210, -54); c.quadraticCurveTo(222, -8, 168, 18); c.lineTo(172, 12); c.quadraticCurveTo(214, -10, 206, -52); c.fill();
  c.strokeStyle = "#e9c46a"; c.lineWidth = 2; c.beginPath(); c.arc(198, -22, 4.5, 0, TAU); c.stroke();
  c.fillStyle = "#fff5dc"; c.font = "700 9px system-ui, sans-serif"; c.textAlign = "center"; c.fillText("R·C", 150, -22);
  // pennant at the bow, flying in the breeze
  c.strokeStyle = "#5a3a22"; c.lineWidth = 2.4; c.beginPath(); c.moveTo(206, -52); c.lineTo(206, -112); c.stroke();
  const fl = Math.sin(t * 6) * 3;
  c.fillStyle = "#ffb81c"; c.beginPath(); c.moveTo(206, -110); c.quadraticCurveTo(190, -104 + fl, 166, -100 + fl * 1.6); c.quadraticCurveTo(190, -94 + fl, 206, -88); c.fill();
  // stern: transom shade and a lifebuoy
  c.fillStyle = "rgba(60,10,6,.32)"; c.beginPath(); c.moveTo(-214, -40); c.quadraticCurveTo(-218, -14, -204, -4); c.lineTo(-198, -10); c.quadraticCurveTo(-208, -18, -206, -36); c.fill();
  c.strokeStyle = "#f6efe0"; c.lineWidth = 7; c.beginPath(); c.arc(-176, -38, 11, 0, TAU); c.stroke();
  c.strokeStyle = "#e0402f"; c.lineWidth = 7; c.setLineDash([8.6, 8.6]); c.beginPath(); c.arc(-176, -38, 11, 0, TAU); c.stroke(); c.setLineDash([]);
  // a coil of rope in the stern
  c.fillStyle = "#c9a35f"; c.beginPath(); c.ellipse(-130, -26, 14, 5, 0, Math.PI, TAU); c.fill();
  c.strokeStyle = "#8f6a30"; c.lineWidth = 1.2; for (let i = 0; i < 3; i++) { c.beginPath(); c.ellipse(-130, -27 + i * 1.2, 13 - i * 2, 4 - i * 0.6, 0, Math.PI, TAU); c.stroke(); }
  // the foredeck the diver stands on
  c.fillStyle = "#c8975a"; c.beginPath(); c.moveTo(138, -50); c.lineTo(205, -56); c.lineTo(203, -50); c.lineTo(138, -44); c.fill();
  c.fillStyle = "#8f6531"; c.fillRect(138, -45, 66, 3);
}

// the inside edge of the near gunwale, drawn over the people's legs so they sit *in* the boat
export function boatRim(c: Ctx) {
  c.strokeStyle = "#e9d6a8"; c.lineWidth = 4; c.lineCap = "round";
  c.beginPath(); c.moveTo(-70, -23); c.quadraticCurveTo(-20, -22, 30, -23); c.stroke();
}

export function oar(c: Ctx, o: V, tip: V, handle: V) {
  c.lineCap = "round";
  c.strokeStyle = "#caa267"; c.lineWidth = 4.2; c.beginPath(); c.moveTo(handle[0], handle[1]); c.lineTo(tip[0], tip[1]); c.stroke();
  c.strokeStyle = "rgba(255,240,200,.55)"; c.lineWidth = 1.2; c.beginPath(); c.moveTo(handle[0], handle[1] - 1); c.lineTo(tip[0], tip[1] - 1); c.stroke();
  // blade: a wider paddle along the last stretch
  const dx = tip[0] - o[0], dy = tip[1] - o[1], len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len, nx = -uy, ny = ux;
  const bx = tip[0] - ux * 48, by = tip[1] - uy * 48;
  c.fillStyle = "#e9453a";
  c.beginPath(); c.moveTo(bx + nx * 3, by + ny * 3); c.lineTo(tip[0] + nx * 8, tip[1] + ny * 8); c.quadraticCurveTo(tip[0] + ux * 6, tip[1] + uy * 6, tip[0] - nx * 8, tip[1] - ny * 8); c.lineTo(bx - nx * 3, by - ny * 3); c.fill();
  c.fillStyle = "#f6efe0"; c.beginPath(); c.moveTo(bx + nx * 3, by + ny * 3); c.lineTo(bx + ux * 12 + nx * 5, by + uy * 12 + ny * 5); c.lineTo(bx + ux * 12 - nx * 5, by + uy * 12 - ny * 5); c.lineTo(bx - nx * 3, by - ny * 3); c.fill();
  // oarlock
  c.fillStyle = "#4a3a2a"; c.beginPath(); c.arc(o[0], o[1], 3.2, 0, TAU); c.fill();
}

/* ---------------------------------------------------------------- sea life */

export type Species = { body: string; belly: string; fin: string; stripe?: string; stripeEdge?: string; spot?: string };
export const FISH: Record<string, Species> = {
  tang: { body: "#ffd21f", belly: "#ffe97a", fin: "#2a6fd8", spot: "#1a2a3a" },
  clown: { body: "#ff7a1a", belly: "#ff9a3c", fin: "#ff6a10", stripe: "#fbfbf4", stripeEdge: "#1a1a1a" },
  angel: { body: "#2f6fe0", belly: "#ffe14a", fin: "#ffd21f", stripe: "#9fd2ff" },
  parrot: { body: "#27c4a6", belly: "#f06aa5", fin: "#5fe0c8", spot: "#8be9d6" },
  chromis: { body: "#3aa0ff", belly: "#8fd0ff", fin: "#2a78e0" },
  butterfly: { body: "#fff2a8", belly: "#fffbe0", fin: "#ffd21f", stripe: "#1a1a1a" },
  coral: { body: "#ff5a4a", belly: "#ff8a6a", fin: "#e0402f", spot: "#fff" },
};

export function fish(c: Ctx, x: number, y: number, len: number, face: 1 | -1, kind: Species, t: number, phase: number, tint: number, water: RGB, pitch = 0) {
  const col = (h: string) => css(mixRGB(hex(h), water, tint));
  const wag = Math.sin(t * 9 + phase) * 0.35;
  c.save(); c.translate(x, y); c.scale(face, 1); c.rotate(pitch);
  const h = len * 0.27;
  // tail
  c.fillStyle = col(kind.fin);
  c.beginPath(); c.moveTo(-len * 0.42, 0); c.lineTo(-len * 0.62, -h * (1.1 + wag * 0.6) - len * 0.04); c.quadraticCurveTo(-len * 0.54, wag * h * 0.6, -len * 0.62, h * (1.1 - wag * 0.6) + len * 0.04); c.closePath(); c.fill();
  // dorsal and pelvic fins
  c.beginPath(); c.moveTo(-len * 0.22, -h * 0.78); c.quadraticCurveTo(-len * 0.02, -h * 1.7, len * 0.2, -h * 0.82); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(-len * 0.06, h * 0.7); c.quadraticCurveTo(-len * 0.12, h * 1.5 + wag * 2, len * 0.1, h * 0.86); c.closePath(); c.fill();
  // body
  const g = c.createLinearGradient(0, -h, 0, h);
  g.addColorStop(0, col(kind.body)); g.addColorStop(0.62, col(kind.body)); g.addColorStop(1, col(kind.belly));
  c.fillStyle = g;
  c.beginPath(); c.moveTo(len * 0.5, 0); c.bezierCurveTo(len * 0.42, -h * 1.05, len * 0.0, -h * 1.1, -len * 0.42, -h * 0.18);
  c.lineTo(-len * 0.42, h * 0.18); c.bezierCurveTo(-len * 0.0, h * 1.1, len * 0.42, h * 1.05, len * 0.5, 0); c.fill();
  if (kind.stripe) {
    c.save(); c.clip();
    for (const px of [0.2, -0.08, -0.34]) {
      if (kind === FISH.clown && px === -0.34) continue;
      if (kind.stripeEdge) { c.fillStyle = col(kind.stripeEdge); c.fillRect(len * px - len * 0.07, -h * 1.3, len * 0.14, h * 2.6); }
      c.fillStyle = col(kind.stripe); c.fillRect(len * px - len * 0.055, -h * 1.3, len * 0.11, h * 2.6);
    }
    c.restore();
  }
  if (kind.spot) { c.fillStyle = col(kind.spot); for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(-len * 0.2 + i * len * 0.14, -h * 0.25 + (i % 2) * h * 0.3, len * 0.025, 0, TAU); c.fill(); } }
  // gloss, gill line, eye
  c.fillStyle = "rgba(255,255,255,.25)"; c.beginPath(); c.ellipse(len * 0.05, -h * 0.55, len * 0.22, h * 0.18, -0.05, 0, TAU); c.fill();
  c.strokeStyle = "rgba(0,0,0,.18)"; c.lineWidth = 1; c.beginPath(); c.arc(len * 0.22, 0, h * 0.8, -1.1, 1.1); c.stroke();
  c.fillStyle = "#fff"; c.beginPath(); c.arc(len * 0.33, -h * 0.2, Math.max(1.6, len * 0.05), 0, TAU); c.fill();
  c.fillStyle = "#101820"; c.beginPath(); c.arc(len * 0.345, -h * 0.2, Math.max(1, len * 0.028), 0, TAU); c.fill();
  c.restore();
}

export function turtle(c: Ctx, x: number, y: number, s: number, face: 1 | -1, t: number, tint: number, water: RGB) {
  const col = (h: string) => css(mixRGB(hex(h), water, tint));
  const stroke = Math.sin(t * 2.2) * 0.5;
  c.save(); c.translate(x, y); c.scale(face * s, s); c.rotate(Math.sin(t * 1.1) * 0.04);
  // far flippers
  c.fillStyle = col("#5e7a3a"); c.beginPath(); c.moveTo(10, 8); c.quadraticCurveTo(50, 36 + stroke * 24, 82, 34 + stroke * 30); c.quadraticCurveTo(44, 20, 4, 14); c.fill();
  c.beginPath(); c.moveTo(-60, 10); c.quadraticCurveTo(-92, 24, -104, 20 + stroke * 8); c.quadraticCurveTo(-82, 12, -56, 4); c.fill();
  // head and neck
  c.fillStyle = col("#9bb25a"); c.beginPath(); c.moveTo(70, -2); c.quadraticCurveTo(100, -8, 118, 0); c.quadraticCurveTo(122, 10, 104, 12); c.quadraticCurveTo(84, 14, 66, 14); c.fill();
  c.fillStyle = col("#6f8a3f"); c.beginPath(); c.ellipse(108, 2, 12, 5, 0.1, 0, TAU); c.fill();
  c.fillStyle = "#101820"; c.beginPath(); c.arc(110, -1, 2.2, 0, TAU); c.fill(); c.fillStyle = "#fff"; c.beginPath(); c.arc(110.8, -1.8, 0.8, 0, TAU); c.fill();
  // shell
  const sh = c.createLinearGradient(0, -52, 0, 22); sh.addColorStop(0, col("#8a6a2f")); sh.addColorStop(0.55, col("#5f4a24")); sh.addColorStop(1, col("#3d2f18"));
  c.fillStyle = sh; c.beginPath(); c.moveTo(-76, 8); c.bezierCurveTo(-72, -50, 56, -58, 76, 6); c.quadraticCurveTo(0, 26, -76, 8); c.fill();
  c.fillStyle = col("#d9c27a"); c.beginPath(); c.moveTo(-72, 10); c.quadraticCurveTo(0, 28, 74, 8); c.quadraticCurveTo(0, 20, -72, 10); c.fill();
  c.strokeStyle = "rgba(20,12,0,.45)"; c.lineWidth = 1.6;
  for (const [a, b, d, e] of [[-34, -34, -10, 4], [0, -46, 4, 6], [34, -32, 12, 4], [-52, -10, -38, 8], [50, -8, 40, 8]] as const) { c.beginPath(); c.moveTo(a, b); c.lineTo(d, e); c.stroke(); }
  c.beginPath(); c.moveTo(-36, -34); c.quadraticCurveTo(0, -48, 34, -32); c.stroke();
  c.strokeStyle = "rgba(255,230,150,.32)"; c.lineWidth = 2; c.beginPath(); c.moveTo(-44, -26); c.quadraticCurveTo(-4, -50, 40, -26); c.stroke();
  // near flippers
  c.fillStyle = col("#7d9a45"); c.beginPath(); c.moveTo(30, 6); c.quadraticCurveTo(70, 30 - stroke * 30, 108, 22 - stroke * 38); c.quadraticCurveTo(70, 12, 22, 14); c.fill();
  c.beginPath(); c.moveTo(-54, 12); c.quadraticCurveTo(-86, 36, -98, 34 - stroke * 10); c.quadraticCurveTo(-76, 22, -48, 16); c.fill();
  c.restore();
}

export function jelly(c: Ctx, x: number, y: number, s: number, t: number, phase: number, hue: RGB, alpha: number) {
  const pulse = Math.sin(t * 2.4 + phase), sx = 1 + pulse * 0.1, sy = 1 - pulse * 0.14;
  c.save(); c.translate(x, y); c.scale(s, s);
  // tentacles
  c.lineCap = "round";
  for (let i = 0; i < 9; i++) {
    const ox = -34 + i * 8.5, len = 90 + hash(phase + i) * 70;
    c.strokeStyle = css(hue, alpha * (i % 2 ? 0.5 : 0.8)); c.lineWidth = i % 2 ? 1.4 : 2.2;
    c.beginPath(); c.moveTo(ox * sx, 10 * sy);
    for (let k = 1; k <= 8; k++) { const f = k / 8; c.lineTo(ox * sx + Math.sin(t * 2 + phase + f * 5 + i) * 9 * f, 10 * sy + f * len - pulse * 8 * f); }
    c.stroke();
  }
  c.strokeStyle = css(mixRGB(hue, [255, 255, 255], 0.35), alpha * 0.8); c.lineWidth = 5;
  for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo((-10 + i * 10) * sx, 8 * sy); for (let k = 1; k <= 7; k++) { const f = k / 7; c.lineTo((-10 + i * 10) * sx + Math.sin(t * 1.6 + phase + f * 4 + i * 2) * 7 * f, 8 * sy + f * 70); } c.stroke(); }
  // bell
  const g = c.createRadialGradient(0, -12 * sy, 4, 0, 0, 52);
  g.addColorStop(0, css(mixRGB(hue, [255, 255, 255], 0.55), alpha * 0.95)); g.addColorStop(0.6, css(hue, alpha * 0.55)); g.addColorStop(1, css(hue, alpha * 0.2));
  c.fillStyle = g; c.beginPath(); c.moveTo(-46 * sx, 10 * sy); c.bezierCurveTo(-46 * sx, -52 * sy, 46 * sx, -52 * sy, 46 * sx, 10 * sy);
  for (let i = 0; i < 6; i++) c.quadraticCurveTo((46 - (i + 0.5) * 15.3) * sx, 18 * sy, (46 - (i + 1) * 15.3) * sx, 10 * sy);
  c.fill();
  c.strokeStyle = css([255, 255, 255], alpha * 0.45); c.lineWidth = 1.5; c.beginPath(); c.arc(0, 0, 40, Math.PI * 1.1, Math.PI * 1.55); c.stroke();
  c.restore();
}

export function manta(c: Ctx, x: number, y: number, s: number, face: 1 | -1, t: number, col: RGB, alpha: number) {
  const f = Math.sin(t * 1.6);
  c.save(); c.translate(x, y); c.scale(face * s, s); c.fillStyle = css(col, alpha);
  const tipY = 6 + f * 38;
  c.beginPath(); c.moveTo(70, 0);
  c.quadraticCurveTo(48, -10 - f * 6, 6, -34 + f * 8 + tipY * -0.2); c.quadraticCurveTo(-30, -52 + tipY * 0.5, -88, tipY - 6);
  c.quadraticCurveTo(-46, -2, -36, 8);
  c.lineTo(-170, 14); c.lineTo(-40, 14);
  c.quadraticCurveTo(-46, 10, -88, tipY + 18 - 22);
  c.quadraticCurveTo(-30, 54 - tipY * 0.2, 6, 28 + f * 6); c.quadraticCurveTo(46, 8, 70, 0); c.fill();
  c.beginPath(); c.moveTo(70, 0); c.quadraticCurveTo(86, -10, 94, -2); c.lineTo(80, 4); c.quadraticCurveTo(88, 10, 76, 8); c.fill();
  c.restore();
}

/* ---------------------------------------------------------------- reef */

export function staghorn(c: Ctx, x: number, y: number, len: number, ang: number, depth: number, seed: number, col: string, tip: string, w: number) {
  const ex = x + Math.sin(ang) * len, ey = y - Math.cos(ang) * len;
  c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + Math.sin(ang + 0.15) * len * 0.5, y - Math.cos(ang + 0.15) * len * 0.5, ex, ey); c.stroke();
  if (depth <= 0) { c.fillStyle = tip; c.beginPath(); c.arc(ex, ey, w * 0.75, 0, TAU); c.fill(); return; }
  staghorn(c, ex, ey, len * 0.72, ang - 0.5 + (hash(seed) - 0.5) * 0.4, depth - 1, seed * 1.7 + 1, col, tip, w * 0.72);
  staghorn(c, ex, ey, len * 0.7, ang + 0.5 + (hash(seed + 3) - 0.5) * 0.4, depth - 1, seed * 2.3 + 2, col, tip, w * 0.72);
  if (depth > 1 && hash(seed + 9) > 0.45) staghorn(c, x + (ex - x) * 0.55, y + (ey - y) * 0.55, len * 0.5, ang + (hash(seed + 5) - 0.5), depth - 2, seed * 3.1, col, tip, w * 0.6);
}

export function brain(c: Ctx, x: number, y: number, r: number, col: string, groove: string) {
  const g = c.createRadialGradient(x - r * 0.3, y - r * 0.5, r * 0.1, x, y, r);
  g.addColorStop(0, col); g.addColorStop(1, groove);
  c.fillStyle = g; c.beginPath(); c.ellipse(x, y, r, r * 0.78, 0, Math.PI, TAU); c.lineTo(x + r, y + r * 0.12); c.lineTo(x - r, y + r * 0.12); c.fill();
  c.strokeStyle = groove; c.lineWidth = Math.max(1, r * 0.05); c.lineCap = "round";
  for (let i = 0; i < 7; i++) { const a = Math.PI + 0.25 + i * 0.4, rr = r * (0.3 + (i % 3) * 0.2); c.beginPath(); c.arc(x + Math.cos(a) * rr * 0.4, y - r * 0.1, rr, a - 0.6, a + 0.6); c.stroke(); }
}

export function seaFan(c: Ctx, x: number, y: number, h: number, col: string, t: number, seed: number) {
  c.strokeStyle = col; c.lineCap = "round"; c.lineWidth = Math.max(1.4, h * 0.02);
  const sway = Math.sin(t * 0.9 + seed) * h * 0.04;
  c.beginPath(); c.moveTo(x, y); c.lineTo(x + sway * 0.5, y - h * 0.3); c.stroke();
  for (let i = -8; i <= 8; i++) {
    const a = i * 0.11 + sway / h;
    c.beginPath(); c.moveTo(x + sway * 0.5, y - h * 0.28); c.lineTo(x + sway * 0.5 + Math.sin(a) * h * 0.85, y - h * 0.28 - Math.cos(a) * h * 0.72); c.stroke();
  }
  c.lineWidth = Math.max(0.8, h * 0.012);
  for (let k = 1; k < 5; k++) { c.beginPath(); for (let i = -8; i <= 8; i++) { const a = i * 0.11 + sway / h, r = k / 5; const px = x + sway * 0.5 + Math.sin(a) * h * 0.85 * r, py = y - h * 0.28 - Math.cos(a) * h * 0.72 * r; if (i === -8) c.moveTo(px, py); else c.lineTo(px, py); } c.stroke(); }
}

export function anemone(c: Ctx, x: number, y: number, r: number, t: number, col: string, tip: string) {
  c.fillStyle = col; c.beginPath(); c.ellipse(x, y, r * 0.45, r * 0.3, 0, Math.PI, TAU); c.fill();
  for (let i = 0; i < 22; i++) {
    const f = i / 21, a = Math.PI + f * Math.PI, sway = Math.sin(t * 1.8 + i * 0.7) * r * 0.1;
    const x0 = x + Math.cos(a) * r * 0.38, ex = x + Math.cos(a) * r * 0.85 + sway, ey = y - Math.sin(a - Math.PI) * r * 0.9;
    c.strokeStyle = col; c.lineWidth = Math.max(1.6, r * 0.07); c.lineCap = "round"; c.beginPath(); c.moveTo(x0, y); c.quadraticCurveTo((x0 + ex) / 2 + sway * 0.5, (y + ey) / 2, ex, ey); c.stroke();
    c.fillStyle = tip; c.beginPath(); c.arc(ex, ey, Math.max(1.2, r * 0.045), 0, TAU); c.fill();
  }
}

export function tubeSponge(c: Ctx, x: number, y: number, w: number, h: number, col: string, inside: string) {
  c.fillStyle = col; c.beginPath(); c.moveTo(x - w / 2, y); c.quadraticCurveTo(x - w * 0.6, y - h * 0.5, x - w * 0.5, y - h); c.lineTo(x + w * 0.5, y - h); c.quadraticCurveTo(x + w * 0.6, y - h * 0.5, x + w / 2, y); c.fill();
  c.fillStyle = inside; c.beginPath(); c.ellipse(x, y - h, w * 0.5, w * 0.16, 0, 0, TAU); c.fill();
  c.strokeStyle = "rgba(255,255,255,.18)"; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x - w * 0.25, y - 4); c.lineTo(x - w * 0.28, y - h + 6); c.stroke();
}

const rr = (c: Ctx, x: number, y: number, w: number, h: number, r: number) => {
  c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
};

/* ---------------------------------------------------------------- the diver, facing us */

// Seen from the front, hip at (x, y). Returns where the torch's lens is, so the light can come from it.
export function frontDiver(c: Ctx, x: number, y: number, t: number, lamp: number, tint: number, water: RGB): V {
  const col = (h: string) => css(mixRGB(hex(h), water, tint));
  const skin = col("#d9a273"), skinDark = col("#b98456"), trunks = col("#ff5a3c"), amber = col("#ffb81c"), navy = col("#14283c");
  const kick = Math.sin(t * 3.1), bob = Math.sin(t * 1.5) * 2;
  c.save(); c.translate(x, y + bob); c.lineCap = "round"; c.lineJoin = "round";
  const line = (a: V, b: V, w: number, st: string) => { c.strokeStyle = st; c.lineWidth = w; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); };

  // legs and fins
  for (const s of [-1, 1] as const) {
    const fx = s * 12 + Math.sin(t * 3.1 + (s > 0 ? 0 : Math.PI)) * 3.5, fy = 61 + Math.cos(t * 3.1 + (s > 0 ? 0 : Math.PI)) * 2;
    const kx = s * 10 + (fx - s * 12) * 0.5, ky = 31;
    line([s * 7, 2], [kx, ky], 13.5, skin); line([s * 7, 2], [lerp(s * 7, kx, 0.5), lerp(2, ky, 0.5)], 14, trunks);
    line([kx, ky], [fx, fy], 10, skin);
    c.fillStyle = navy; c.beginPath(); c.moveTo(fx - 4.5, fy); c.lineTo(fx + 4.5, fy); c.quadraticCurveTo(fx + s * 14 + 10, fy + 14, fx + s * 12 + 11, fy + 36); c.quadraticCurveTo(fx + s * 10, fy + 42, fx + s * 12 - 11, fy + 36); c.quadraticCurveTo(fx + s * 14 - 10, fy + 14, fx - 4.5, fy); c.fill();
    c.strokeStyle = amber; c.lineWidth = 2; c.beginPath(); c.moveTo(fx + s * 4, fy + 5); c.lineTo(fx + s * 12, fy + 33); c.stroke();
  }
  // torso
  const tg = c.createLinearGradient(-20, 0, 20, 0); tg.addColorStop(0, col("#e9b786")); tg.addColorStop(0.5, skin); tg.addColorStop(1, skinDark);
  c.fillStyle = tg; c.beginPath(); c.moveTo(-19, -46); c.quadraticCurveTo(-21, -22, -13, 2); c.lineTo(13, 2); c.quadraticCurveTo(21, -22, 19, -46); c.quadraticCurveTo(0, -53, -19, -46); c.fill();
  c.strokeStyle = css(mixRGB(hex("#8a5a34"), water, tint), 0.55); c.lineWidth = 1.3;
  c.beginPath(); c.moveTo(-2, -44); c.lineTo(-2, -4); c.moveTo(-14, -34); c.quadraticCurveTo(-7, -29, -1, -33); c.moveTo(14, -34); c.quadraticCurveTo(7, -29, 1, -33); c.stroke();
  c.fillStyle = trunks; c.beginPath(); c.moveTo(-13.5, -4); c.lineTo(13.5, -4); c.lineTo(15, 17); c.quadraticCurveTo(7, 22, 0, 16); c.quadraticCurveTo(-7, 22, -15, 17); c.fill();
  c.fillStyle = amber; c.fillRect(-13.5, -4, 27, 3.4);
  // arms: one hangs, one holds the torch out toward us
  line([18, -43], [28, -20], 10, skin); line([28, -20], [23, 2], 9, skin);
  c.fillStyle = skin; c.beginPath(); c.arc(23, 4, 4.6, 0, TAU); c.fill();
  line([-18, -43], [-31, -26], 10.5, skin); line([-31, -26], [-25, -35], 12, skin);
  // neck, head, ears, hair
  line([0, -52], [0, -58], 10, skinDark);
  c.fillStyle = skin; c.beginPath(); c.arc(-12.4, -67, 3.2, 0, TAU); c.arc(12.4, -67, 3.2, 0, TAU); c.fill();
  const hg = c.createRadialGradient(-3, -72, 2, 0, -68, 14); hg.addColorStop(0, col("#e6b88a")); hg.addColorStop(1, skin);
  c.fillStyle = hg; c.beginPath(); c.ellipse(0, -67.5, 12.2, 13.4, 0, 0, TAU); c.fill();
  c.fillStyle = col("#241a14"); c.beginPath(); c.ellipse(0, -73, 12.6, 9, 0, Math.PI, TAU); c.fill(); c.fillRect(-12.6, -73.4, 25.2, 3);
  // mask: strap, frame, glass, eyes looking straight at us
  c.strokeStyle = col("#1b2a3a"); c.lineWidth = 3.4; c.beginPath(); c.moveTo(-12.4, -67.5); c.lineTo(12.4, -67.5); c.stroke();
  c.fillStyle = css(mixRGB([150, 226, 248], water, tint * 0.5), 0.92); c.strokeStyle = amber; c.lineWidth = 2.6;
  rr(c, -11.5, -74.5, 23, 13, 5); c.fill(); c.stroke();
  c.fillStyle = "#f4f4ee"; c.beginPath(); c.ellipse(-4.6, -68, 2.5, 2.1, 0, 0, TAU); c.ellipse(4.6, -68, 2.5, 2.1, 0, 0, TAU); c.fill();
  c.fillStyle = "#1a1410"; c.beginPath(); c.arc(-4.5, -68, 1.25, 0, TAU); c.arc(4.5, -68, 1.25, 0, TAU); c.fill();
  c.strokeStyle = "rgba(255,255,255,.55)"; c.lineWidth = 1.4; c.beginPath(); c.moveTo(-9, -72.5); c.lineTo(-5.5, -72.5); c.stroke();
  c.fillStyle = skinDark; c.beginPath(); c.ellipse(0, -60.4, 2.6, 2, 0, 0, TAU); c.fill();
  c.strokeStyle = col("#7a3a2a"); c.lineWidth = 1.3; c.beginPath(); c.arc(0, -57.6, 3.6, 0.25, Math.PI - 0.25); c.stroke();
  // snorkel
  c.strokeStyle = navy; c.lineWidth = 3.6; c.beginPath(); c.moveTo(-12.2, -66); c.quadraticCurveTo(-21, -76, -18, -98); c.stroke();
  c.strokeStyle = amber; c.lineWidth = 3.6; c.beginPath(); c.moveTo(-18.2, -92); c.lineTo(-18, -98); c.stroke();

  // the torch, pointed at us
  const tx = -25, ty = -36;
  c.fillStyle = col("#1c2630"); c.beginPath(); c.arc(tx, ty, 10.5, 0, TAU); c.fill();
  c.strokeStyle = amber; c.lineWidth = 2; c.beginPath(); c.arc(tx, ty, 8.6, 0, TAU); c.stroke();
  const lg = c.createRadialGradient(tx, ty, 0, tx, ty, 7.4);
  lg.addColorStop(0, `rgba(255,255,255,${0.25 + lamp * 0.75})`); lg.addColorStop(0.6, `rgba(255,${200 + lamp * 40},${120 + lamp * 40},${0.35 + lamp * 0.6})`); lg.addColorStop(1, "rgba(255,150,40,.3)");
  c.fillStyle = lg; c.beginPath(); c.arc(tx, ty, 7.4, 0, TAU); c.fill();
  c.fillStyle = skin; c.beginPath(); c.arc(tx - 8, ty + 8, 4.4, 0, TAU); c.arc(tx + 7, ty + 9, 3.8, 0, TAU); c.fill();
  c.restore();
  return [x + tx, y + ty + bob];
}

// A cone of torchlight from a point, along an angle, on a dark scene.
export function beam(c: Ctx, o: V, ang: number, len: number, spread: number, amount: number) {
  if (amount <= 0.01) return;
  const d = dir(ang);
  c.save(); c.globalCompositeOperation = "lighter";
  const g = c.createRadialGradient(o[0], o[1], 0, o[0], o[1], len);
  g.addColorStop(0, `rgba(255,244,214,${0.62 * amount})`); g.addColorStop(0.35, `rgba(150,224,240,${0.26 * amount})`); g.addColorStop(1, "rgba(80,170,210,0)");
  c.fillStyle = g;
  for (const k of [1, 0.7, 0.42]) {
    c.beginPath(); c.moveTo(o[0], o[1]);
    for (let i = 0; i <= 12; i++) { const a = ang - spread * k + (i / 12) * spread * k * 2, v = dir(a); c.lineTo(o[0] + v[0] * len, o[1] + v[1] * len); }
    c.closePath(); c.globalAlpha = 0.5; c.fill();
  }
  c.globalAlpha = 1;
  const core = c.createRadialGradient(o[0], o[1], 0, o[0], o[1], 70);
  core.addColorStop(0, `rgba(255,250,230,${0.95 * amount})`); core.addColorStop(0.3, `rgba(255,214,130,${0.5 * amount})`); core.addColorStop(1, "rgba(255,184,28,0)");
  c.fillStyle = core; c.beginPath(); c.arc(o[0], o[1], 70, 0, TAU); c.fill();
  void d; c.restore();
}

/* ---------------------------------------------------------------- the diver, turning in three dimensions */

export type Seg = { a1: number; s1: number; a2: number; s2: number };
export type Rig = { x: number; y: number; pitch: number; yaw: number; hy: number; hp: number; R: Seg; L: Seg; Rl: Seg; Ll: Seg };
export type RigOut = { head: V; torch: V; hand: V; aim: [number, number, number] };

export const RIG_KEYS = ["pitch", "yaw", "hy", "hp"] as const;
export const rigToVec = (r: Rig): number[] => [r.pitch, r.yaw, r.hy, r.hp, ...[r.R, r.L, r.Rl, r.Ll].flatMap((s) => [s.a1, s.s1, s.a2, s.s2])];
export const vecToRig = (v: number[], x: number, y: number): Rig => {
  const seg = (i: number): Seg => ({ a1: v[i], s1: v[i + 1], a2: v[i + 2], s2: v[i + 3] });
  return { x, y, pitch: v[0], yaw: v[1], hy: v[2], hp: v[3], R: seg(4), L: seg(8), Rl: seg(12), Ll: seg(16) };
};

// Catmull-Rom through timed keys, so the motion flows through each pose instead of stopping on it.
export function spline(keys: [number, number[]][], t: number): number[] {
  if (t <= keys[0][0]) return keys[0][1];
  const last = keys.length - 1;
  if (t >= keys[last][0]) return keys[last][1];
  let i = 0; while (i < last - 1 && t > keys[i + 1][0]) i++;
  const [t0, p0] = keys[i], [t1, p1] = keys[i + 1];
  const pm = keys[Math.max(0, i - 1)], pn = keys[Math.min(last, i + 2)];
  const h = t1 - t0, s = (t - t0) / h, s2 = s * s, s3 = s2 * s;
  return p0.map((v0, k) => {
    const m0 = ((p1[k] - pm[1][k]) / (t1 - pm[0] || 1)) * h, m1 = ((pn[1][k] - p0[k]) / (pn[0] - t0 || 1)) * h;
    return (2 * s3 - 3 * s2 + 1) * v0 + (s3 - 2 * s2 + s) * m0 + (-2 * s3 + 3 * s2) * p1[k] + (s3 - s2) * m1;
  });
}


// The diver as a small skeleton in three dimensions: body pitch (0 = upright), yaw (0 = in profile, PI/2 = facing us), and limbs
// whose angles are measured from the body's own axis. Drawn back to front, so he can roll over, turn and look about.
export function diverRig(c: Ctx, r: Rig, t: number, tint: number, water: RGB, lamp: number): RigOut {
  const col = (h: string) => css(mixRGB(hex(h), water, tint));
  const skin = col("#d9a273"), skinDark = col("#b98456"), trunks = col("#ff5a3c"), amber = col("#ffb81c"), navy = col("#14283c");
  const U = dir(r.pitch), Rv: V = [Math.cos(r.pitch), Math.sin(r.pitch)];
  const cy = Math.cos(r.yaw), sy = Math.sin(r.yaw), fo = Math.abs(sy);
  type P3 = { p: V; z: number };
  const at = (up: number, f: number, l: number): P3 => {
    const x = f * cy - l * sy, z = f * sy + l * cy;
    return { p: [r.x + U[0] * up + Rv[0] * x, r.y + U[1] * up + Rv[1] * x], z };
  };
  const step = (o: { up: number; f: number; l: number }, a: number, s: number, len: number, side: number) => ({ up: o.up + Math.cos(a) * Math.cos(s) * len, f: o.f + Math.sin(a) * Math.cos(s) * len, l: o.l + Math.sin(s) * len * side });
  const chain = (start: { up: number; f: number; l: number }, seg: Seg, l1: number, l2: number, side: number) => {
    const m = step(start, seg.a1, seg.s1, l1, side), e = step(m, seg.a2, seg.s2, l2, side);
    return { s: at(start.up, start.f, start.l), m: at(m.up, m.f, m.l), e: at(e.up, e.f, e.l), d: [e.f - m.f, e.up - m.up, e.l - m.l] as [number, number, number] };
  };
  const sh = (side: number) => ({ up: LIMB.torso, f: 0, l: side * (11 + 6 * fo) });
  const hp = (side: number) => ({ up: 0, f: 0, l: side * 7 });
  const arms = { R: chain(sh(1), r.R, LIMB.upper, LIMB.fore, 1), L: chain(sh(-1), r.L, LIMB.upper, LIMB.fore, -1) };
  const legs = { R: chain(hp(1), r.Rl, LIMB.thigh, LIMB.shin, 1), L: chain(hp(-1), r.Ll, LIMB.thigh, LIMB.shin, -1) };
  const sc = (z: number) => 1 + z * 0.0035;
  const limb = (a: P3, b: P3, w: number, st: string) => {
    c.strokeStyle = st; c.lineWidth = w * sc((a.z + b.z) / 2); c.lineCap = "round";
    c.beginPath(); c.moveTo(a.p[0], a.p[1]); c.lineTo(b.p[0], b.p[1]); c.stroke();
  };
  const mid = (a: P3, b: P3, k: number): P3 => ({ p: [lerp(a.p[0], b.p[0], k), lerp(a.p[1], b.p[1], k)], z: lerp(a.z, b.z, k) });
  const zOf = (k: { s: P3; e: P3; m: P3 }) => (k.m.z + k.e.z) / 2;

  const drawLeg = (k: ReturnType<typeof chain>, near: boolean) => {
    const sk = near && k.m.z >= -2 ? skin : skinDark;
    limb(k.s, mid(k.s, k.m, 0.62), 13.5, trunks); limb(mid(k.s, k.m, 0.55), k.m, 10.5, sk); limb(k.m, k.e, 9.2, sk);
    const d = [k.e.p[0] - k.m.p[0], k.e.p[1] - k.m.p[1]], len = Math.hypot(d[0], d[1]) || 1;
    // a fin, pointed along the shin
    const fx = k.e.p[0] + (d[0] / len) * 22, fy = k.e.p[1] + (d[1] / len) * 22, nx = -d[1] / len, ny = d[0] / len;
    c.fillStyle = navy; c.beginPath(); c.moveTo(k.e.p[0] + nx * 4, k.e.p[1] + ny * 4); c.lineTo(fx + nx * 10, fy + ny * 10); c.quadraticCurveTo(fx + (d[0] / len) * 6, fy + (d[1] / len) * 6, fx - nx * 10, fy - ny * 10); c.lineTo(k.e.p[0] - nx * 4, k.e.p[1] - ny * 4); c.fill();
    c.strokeStyle = amber; c.lineWidth = 1.6; c.beginPath(); c.moveTo(k.e.p[0] + d[0] / len * 4, k.e.p[1] + d[1] / len * 4); c.lineTo(fx, fy); c.stroke();
  };
  const drawArm = (k: ReturnType<typeof chain>, near: boolean) => {
    const sk = near && k.m.z >= -2 ? skin : skinDark;
    limb(k.s, k.m, 9, sk); limb(k.m, k.e, 7.8, sk);
    c.fillStyle = sk; c.beginPath(); c.arc(k.e.p[0], k.e.p[1], 4.4 * sc(k.e.z), 0, TAU); c.fill();
  };

  const hipP = at(0, 0, 0), shP = at(LIMB.torso, 0, 0);
  const drawTorso = () => {
    const w = lerp(21, 30, fo * fo);
    limb(hipP, shP, w, skin);
    // shading across the chest as he turns to face us, and the trunks over the hips
    if (fo > 0.35) {
      c.strokeStyle = css(mixRGB(hex("#8a5a34"), water, tint), 0.5 * fo); c.lineWidth = 1.2;
      const a = mid(hipP, shP, 0.82), b = mid(hipP, shP, 0.3), n: V = [Rv[0], Rv[1]];
      c.beginPath(); c.moveTo(a.p[0] - n[0] * 12, a.p[1] - n[1] * 12); c.quadraticCurveTo(a.p[0] - n[0] * 5 + U[0] * -5, a.p[1] - n[1] * 5 + U[1] * -5, a.p[0], a.p[1] + 1);
      c.moveTo(a.p[0] + n[0] * 12, a.p[1] + n[1] * 12); c.quadraticCurveTo(a.p[0] + n[0] * 5 + U[0] * -5, a.p[1] + n[1] * 5 + U[1] * -5, a.p[0], a.p[1] + 1);
      c.moveTo(a.p[0], a.p[1]); c.lineTo(b.p[0], b.p[1]); c.stroke();
    }
    limb(hipP, mid(hipP, shP, 0.22), w + 1, trunks);
    limb(mid(hipP, shP, 0.2), mid(hipP, shP, 0.27), w + 1.5, amber);
    limb(shP, at(LIMB.torso + 9, 0, 0), 8, skinDark);
  };

  // everything that is not the head, far to near
  const parts: [number, () => void][] = [
    [zOf(arms.L), () => drawArm(arms.L, false)], [zOf(arms.R), () => drawArm(arms.R, true)],
    [zOf(legs.L), () => drawLeg(legs.L, false)], [zOf(legs.R), () => drawLeg(legs.R, true)],
    [0, drawTorso],
  ];
  parts.sort((a, b) => a[0] - b[0]).forEach(([, f]) => f());

  // head
  const fy = r.yaw + r.hy, fyc = Math.cos(fy), fyo = Math.abs(Math.sin(fy));
  const ha = r.pitch + r.hp * 0.9, HU = dir(ha), HR: V = [Math.cos(ha), Math.sin(ha)];
  const nk = at(LIMB.torso + 6, 0, 0).p;
  const hc: V = [nk[0] + HU[0] * 12, nk[1] + HU[1] * 12];
  const off = (a: number, b: number): V => [hc[0] + HR[0] * a + HU[0] * b, hc[1] + HR[1] * a + HU[1] * b];
  // snorkel: behind the head on the near side
  const sb = off(-(2 + 9 * fyo), -2), st = off(-(5 + 9 * fyo), 31);
  c.strokeStyle = navy; c.lineWidth = 3.6; c.lineCap = "round"; c.beginPath(); c.moveTo(sb[0], sb[1]); c.quadraticCurveTo(off(-(10 + 8 * fyo), 14)[0], off(-(10 + 8 * fyo), 14)[1], st[0], st[1]); c.stroke();
  c.strokeStyle = amber; c.beginPath(); c.moveTo(off(-(5 + 9 * fyo), 25)[0], off(-(5 + 9 * fyo), 25)[1]); c.lineTo(st[0], st[1]); c.stroke();
  c.fillStyle = col("#241a14"); c.beginPath(); c.arc(hc[0], hc[1], 11.8, 0, TAU); c.fill();
  const sk0 = off(3.6 * fyc, -(1.4 + 3 * fyo));
  const hg = c.createRadialGradient(sk0[0] - 3, sk0[1] - 3, 2, sk0[0], sk0[1], 13);
  hg.addColorStop(0, col("#e6b88a")); hg.addColorStop(1, skin);
  c.fillStyle = hg; c.beginPath(); c.arc(sk0[0], sk0[1], 9.4 + 2.5 * fyo, 0, TAU); c.fill();
  if (fyo > 0.55) { c.fillStyle = skin; for (const sgn of [-1, 1]) { const e = off(sgn * 12.4, -1); c.beginPath(); c.arc(e[0], e[1], 3.1, 0, TAU); c.fill(); } }
  // mask: narrow in profile, wide face-on, with the eyes showing through once he faces us
  const mc = off(7.2 * fyc * (1 - 0.35 * fyo), 2.6), mw = lerp(3.8, 11.5, fyo);
  c.strokeStyle = col("#1b2a3a"); c.lineWidth = 3.2; c.beginPath(); const s1 = off(-12.2 * fyo - 4 * Math.abs(fyc), 2.6); c.moveTo(mc[0], mc[1]); c.lineTo(s1[0], s1[1]); c.stroke();
  c.save(); c.translate(mc[0], mc[1]); c.rotate(ha);
  c.fillStyle = css(mixRGB([150, 226, 248], water, tint * 0.5), 0.93); c.strokeStyle = amber; c.lineWidth = 2.4;
  rr(c, -mw, -6.4, mw * 2, 12.8, Math.min(5, mw)); c.fill(); c.stroke();
  if (fyo > 0.4) {
    const look = clamp(fyc * 1.6 + r.hy * 0.6, -1, 1), ex = 4.6 * fyo;
    c.fillStyle = "#f4f4ee"; c.beginPath(); c.ellipse(-ex, 0, 2.6 * fyo, 2.2, 0, 0, TAU); c.ellipse(ex, 0, 2.6 * fyo, 2.2, 0, 0, TAU); c.fill();
    c.fillStyle = "#1a1410"; c.beginPath(); c.arc(-ex + look * 1.2, 0, 1.3, 0, TAU); c.arc(ex + look * 1.2, 0, 1.3, 0, TAU); c.fill();
  }
  c.strokeStyle = "rgba(255,255,255,.55)"; c.lineWidth = 1.4; c.beginPath(); c.moveTo(-mw * 0.7, -3.6); c.lineTo(-mw * 0.25, -3.6); c.stroke();
  c.restore();
  const nose = off(4 * fyc * 1.1, -5.6);
  c.fillStyle = skinDark; c.beginPath(); c.ellipse(nose[0], nose[1], 2.4, 2, ha, 0, TAU); c.fill();
  if (fyo > 0.5) { const m = off(1.5 * fyc, -9.6); c.strokeStyle = col("#7a3a2a"); c.lineWidth = 1.3; c.beginPath(); c.arc(m[0], m[1] + 1, 3.4, 0.25, Math.PI - 0.25); c.stroke(); }

  // the torch, in the near hand, pointing the way the forearm points
  const hand = arms.R.e, d = arms.R.d, dl = Math.hypot(d[0], d[1], d[2]) || 1;
  const nd: [number, number, number] = [d[0] / dl, d[1] / dl, d[2] / dl]; // fwd, up, lat
  const dx = nd[0] * cy - nd[2] * sy, dz = nd[0] * sy + nd[2] * cy; // across the screen along the body's right, and toward us
  const sd: V = [Rv[0] * dx + U[0] * nd[1], Rv[1] * dx + U[1] * nd[1]];
  const sl = Math.hypot(sd[0], sd[1]);
  const tail: V = [hand.p[0] - sd[0] * 7, hand.p[1] - sd[1] * 7], front: V = [hand.p[0] + sd[0] * 15, hand.p[1] + sd[1] * 15];
  c.strokeStyle = navy; c.lineWidth = 9 * sc(hand.z); c.lineCap = "round"; c.beginPath(); c.moveTo(tail[0], tail[1]); c.lineTo(front[0], front[1]); c.stroke();
  c.fillStyle = skin; c.beginPath(); c.arc(hand.p[0], hand.p[1], 5 * sc(hand.z), 0, TAU); c.fill();
  const face = clamp(dz, 0, 1), ang = Math.atan2(sd[1], sd[0]);
  c.save(); c.translate(front[0], front[1]); c.rotate(ang + Math.PI / 2);
  const lr = 8.6 * sc(hand.z);
  c.fillStyle = amber; c.beginPath(); c.ellipse(0, 0, lr, lr * (0.22 + 0.78 * face), 0, 0, TAU); c.fill();
  c.fillStyle = `rgba(255,${200 + lamp * 50},${150 + lamp * 70},${0.4 + lamp * 0.6})`; c.beginPath(); c.ellipse(0, 0, lr * 0.74, lr * 0.74 * (0.22 + 0.78 * face), 0, 0, TAU); c.fill();
  c.restore();
  void sl;
  return { head: hc, torch: front, hand: hand.p, aim: [sd[0], sd[1], dz] };
}
