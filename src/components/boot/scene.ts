import {
  FISH, RAMP_STOPS, TAU, anemone, beam, boatHull, brain, clamp, cloud, css, dir, ease, diverRig, fish, fk, gull, hash, hex, jelly, lerp, manta,
  mixRGB, oar, palm, person, reach, rigToVec, seaColour, seaFan, smooth, spline, staghorn, sun, tubeSponge, turtle, vecToRig,
} from "./art";
import type { Ctx, Look, Pose, RGB, Rig, Seg, V } from "./art";

/*
 * The opening, as a film shot in one continuous take.
 *   0.0 – 2.2   a morning on a tropical sea: a red rowing boat under way, a rower at the oars, a diver on the bow limbering up
 *   2.2 – 3.3   the diver leaps in a long arc, hands first, and the sea closes over him in a crown of spray
 *   3.3 – 6.2   the camera follows him down past the reef: fish, a turtle, jellyfish, a manta
 *   6.2 – 7.4   the plunge into dark water, the light fading to black
 *   7.3         he reaches the bottom, switches on his torch, and panics: he rolls upright, looks about, sweeps the light around,
 *               then turns to face us and points it at the screen. The camera pushes in; the light floods the screen
 * drawScene(t) is a pure function of time, so any frame can be redrawn exactly (and checked with ?bootSeek=).
 */

export const T_LEAP = 2.2;
const G = 1100, VY0 = -480, VX = 160, HIP0: V = [162, -121];
const T_WATER = T_LEAP + (-VY0 + Math.sqrt(VY0 * VY0 + 4 * (G / 2) * (-HIP0[1] + 0))) / G; // hip reaches y = 0
const T_ENTRY = T_LEAP + (-VY0 + Math.sqrt(VY0 * VY0 - 4 * (G / 2) * (HIP0[1] + 100))) / G; // hands touch the surface
const SINK = 1900, CX = 360;
// One steady descent: a short ease from the speed of the entry into a cruise, and a short ease out at the bottom. No surge, no lull.
const V_CRUISE = 560, EASE_IN = 0.7, EASE_OUT = 0.6;
const V_ENTRY = VY0 + G * (T_WATER - T_LEAP);
const Y_IN = (EASE_IN * (V_ENTRY + V_CRUISE)) / 2, Y_OUT = (EASE_OUT * V_CRUISE) / 2;
const T_CRUISE = (SINK - Y_IN - Y_OUT) / V_CRUISE;
const T_BOTTOM = T_WATER + EASE_IN + T_CRUISE + EASE_OUT;
const T_F0 = T_BOTTOM - 0.2; // the finale starts as he slows
export const T_LIGHT = T_BOTTOM + 0.05, T_FACE = T_F0 + 2.85;
export const DEPTH_UNITS_PER_METRE = 20;

const rowerLook: Look = { skin: "#d9a273", skinDark: "#b98456", hair: "#3a2a20", top: "#f2f2ea", bottom: "#27456b", trim: "#1c3350", hat: true, shirtStripe: "#2b6fb5", sleeves: false };
const diverLook: Look = { skin: "#d9a273", skinDark: "#b98456", hair: "#241a14", top: "#d9a273", bottom: "#ff5a3c", trim: "#ffb81c", mask: true };

/* ---------------------------------------------------------------- the rowing, tabulated once */

const ROW = 0.42; // the drive is this share of each stroke
const STEP = 1 / 60;
const glideAt = (t: number) => 1 - 0.88 * smooth((t - (T_LEAP - 0.1)) / 1.3);
const PH: number[] = [], OFF: number[] = [], STROKES: { t: number; off: number }[] = [];
(() => {
  let ph = 0, off = 0, last = 0;
  for (let i = 0; i <= 15 / STEP; i++) {
    const k = i * STEP; PH.push(ph); OFF.push(off);
    ph += (glideAt(k) * STEP) / 1.3;
    const cyc = ph % 1, pulse = cyc < ROW ? Math.sin((Math.PI * cyc) / ROW) : 0;
    off += glideAt(k) * (0.5 + 0.95 * pulse) * STEP;
    if (last < 0.21 && cyc >= 0.21) STROKES.push({ t: k, off });
    last = cyc;
  }
})();
const tab = (a: number[], t: number) => { const f = clamp(t / STEP, 0, a.length - 2), i = Math.floor(f); return lerp(a[i], a[i + 1], f - i); };
const rowPhaseAt = (t: number) => tab(PH, t);
const sOffAt = (t: number) => tab(OFF, t); // how far the boat has travelled through the water
const SCROLL = 220; // how fast the water streams past, per unit of that

const waveY = (x: number, t: number, off: number, ripple: number, xin: number) => {
  let y = 3.4 * Math.sin((x + off * SCROLL) * 0.014 + t * 1.5) + 1.8 * Math.sin((x + off * SCROLL) * 0.037 - t * 2.2);
  if (ripple > 0) {
    const a = t - T_ENTRY, r = Math.abs(x - xin);
    if (r < a * 170 + 30) y += 9 * Math.exp(-a * 1.5) * Math.exp(-r * 0.0055) * Math.sin((r - a * 150) * 0.045) * smooth(a * 6);
  }
  return y;
};

/* ---------------------------------------------------------------- the diver's path */

const herm = (s: number, p0: number, p1: number, m0: number, m1: number) =>
  (2 * s ** 3 - 3 * s * s + 1) * p0 + (s ** 3 - 2 * s * s + s) * m0 + (-2 * s ** 3 + 3 * s * s) * p1 + (s ** 3 - s * s) * m1;
const X_WATER = HIP0[0] + VX * (T_WATER - T_LEAP);

function diverPos(t: number): { x: number; y: number } {
  if (t < T_LEAP) return { x: HIP0[0], y: HIP0[1] };
  if (t < T_WATER) { const a = t - T_LEAP; return { x: HIP0[0] + VX * a, y: HIP0[1] + VY0 * a + 0.5 * G * a * a }; }
  const x = X_WATER + 22 * ease((t - T_WATER) / (T_BOTTOM - T_WATER));
  const a = t - T_WATER;
  if (a < EASE_IN) return { x, y: herm(a / EASE_IN, 0, Y_IN, V_ENTRY * EASE_IN, V_CRUISE * EASE_IN) };
  if (a < EASE_IN + T_CRUISE) return { x, y: Y_IN + (a - EASE_IN) * V_CRUISE };
  if (t < T_BOTTOM) return { x, y: herm((a - EASE_IN - T_CRUISE) / EASE_OUT, Y_IN + T_CRUISE * V_CRUISE, SINK, V_CRUISE * EASE_OUT, 0) };
  return { x, y: SINK + (t - T_BOTTOM) * 6 };
}

// moments of fast movement, where the picture is blended over a few instants like a camera shutter
export const inMotion = (t: number) => (t > T_LEAP && t < T_ENTRY + 0.4) || (t > T_F0 && t < T_FACE + 0.3);

const lampAt = (t: number) => { const a = t - T_LIGHT; return a < 0 ? 0 : a < 0.07 ? 1 : a < 0.14 ? 0.12 : 1; };

/* ---------------------------------------------------------------- poses */

const BASE = { lu: 2.99, lf: 2.75, ru: 3.24, rf: 3.0, lt: 3.1, ls: 3.17, rt: 3.2, rs: 3.12 };
type K = Omit<Pose, "x" | "y"> & { dx: number; dy: number };
const KEY: Record<string, K> = {
  stand: { dx: 0, dy: 0, torso: 0.04, head: 0.05, ...BASE },
  look: { dx: 0, dy: 0, torso: 0.1, head: -0.12, ...BASE, ru: 3.0, rf: 2.2 }, // a hand to the brow
  stretch: { dx: 0, dy: 0, torso: -0.1, head: -0.15, lu: 0.35, lf: 0.2, ru: 0.12, rf: 0.04, lt: 3.1, ls: 3.17, rt: 3.2, rs: 3.12 },
  crouch: { dx: -7, dy: 26, torso: 0.95, head: -0.55, lu: -2.35, lf: -2.6, ru: -2.1, rf: -2.45, lt: 2.0, ls: 3.9, rt: 2.1, rs: 3.8 },
  launch: { dx: 0, dy: 0, torso: 0.55, head: -0.2, lu: 1.5, lf: 1.4, ru: 1.35, rf: 1.25, lt: 3.55, ls: 3.45, rt: 3.35, rs: 3.3 },
};
const mixK = (a: K, b: K, k: number): K => {
  const o = {} as Record<string, number>;
  for (const key of Object.keys(a) as (keyof K)[]) o[key] = lerp(a[key] as number, b[key] as number, k);
  return o as unknown as K;
};
const toPose = (k: K, x: number, y: number, extra: Partial<Pose> = {}): Pose => ({ ...k, x: x + k.dx, y: y + k.dy, ...extra });

function standingPose(t: number): K {
  const breathe = Math.sin(t * 2.2) * 0.012;
  const mix = (a: string, b: string, k: number) => mixK(KEY[a], KEY[b], smooth(k));
  let k: K;
  if (t < 0.6) k = mix("stand", "look", t / 0.6);
  else if (t < 1.1) k = mix("look", "stand", (t - 0.6) / 0.5);
  else if (t < 1.5) k = mix("stand", "stretch", (t - 1.1) / 0.4);
  else if (t < 2.05) k = mix("stretch", "crouch", (t - 1.5) / 0.55);
  else k = KEY.crouch;
  return { ...k, torso: k.torso + breathe };
}

function divingPose(t: number): { pose: Pose; ang: number; turn: number } {
  const p = diverPos(t);
  if (t < T_LEAP + 0.16) {
    // the spring: from the crouch to the launch
    const k = smooth((t - (T_LEAP - 0.15)) / 0.31);
    const pose = toPose(mixK(KEY.crouch, KEY.launch, k), p.x, p.y);
    return { pose, ang: pose.torso, turn: 0 };
  }
  const a = t - T_LEAP;
  const s = smooth((a - 0.1) / (T_WATER - T_LEAP - 0.2));
  const ang = lerp(0.62, Math.PI - 0.06, s);
  if (t < T_WATER) {
    const ext = smooth((a - 0.1) / 0.5);
    const arm = ang + lerp(0.9, 0.04, ext);
    const leg = ang + Math.PI - lerp(0.3, 0.05, smooth((a - 0.3) / 0.6));
    return { ang, turn: 0, pose: { x: p.x, y: p.y, torso: ang, head: lerp(-0.2, 0, s), lu: arm, lf: arm - 0.02, ru: arm + 0.06, rf: arm + 0.04, lt: leg, ls: leg + 0.03, rt: leg - 0.06, rs: leg - 0.02, pointed: 1 } };
  }
  // under the surface: gliding, kicking, then turning upright to face us
  const w = t * 7.2, glide = smooth((t - T_WATER) / 0.7);
  const sway = Math.sin(t * 1.3) * 0.07, scull = Math.sin(t * 2.4) * 0.09;
  const turn = 0;
  const torso = lerp(Math.PI - 0.06 + sway, 0.08, turn);
  const kick = glide * 0.5 * (1 - turn * 0.6), base = torso + Math.PI;
  return {
    ang: torso, turn,
    pose: {
      x: p.x, y: p.y, torso, head: -0.04 + Math.sin(t * 0.9) * 0.05,
      lu: torso + 0.08 + scull, lf: torso + 0.02 + scull * 1.2, ru: torso - 0.05 - scull, rf: torso - 0.02 - scull * 1.2,
      lt: base + kick * Math.sin(w) * 0.9 + 0.1, ls: base + kick * Math.sin(w - 1.1) * 1.1 + 0.08,
      rt: base + kick * Math.sin(w + Math.PI) * 0.9 - 0.08, rs: base + kick * Math.sin(w + Math.PI - 1.1) * 1.1 - 0.04, pointed: 1 - turn,
    },
  };
}


/* ---------------------------------------------------------------- the diver, from the leap to the last look */

const NORM = (a: number) => ((((a + Math.PI / 2) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI / 2;
function poseToRig(p: Pose): Rig {
  const seg = (a1: number, a2: number): Seg => ({ a1: NORM(a1 - p.torso), s1: 0, a2: NORM(a2 - p.torso), s2: 0 });
  return { x: p.x, y: p.y, pitch: p.torso, yaw: 0, hy: 0, hp: p.head, R: seg(p.ru, p.rf), L: seg(p.lu, p.lf), Rl: seg(p.rt, p.rs), Ll: seg(p.lt, p.ls) };
}
const PI = Math.PI;
const mk = (pitch: number, yaw: number, hy: number, hp: number, R: number[], L: number[], Rl: number[], Ll: number[]) =>
  [pitch, yaw, hy, hp, ...R, ...L, ...Rl, ...Ll];
const LEGS_DOWN: [number[], number[]] = [[PI - 0.2, 0.15, PI - 0.3, 0], [PI + 0.2, -0.1, PI + 0.3, 0]];
let finaleKeys: [number, number[]][] | null = null;
function finaleAt(t: number, x: number, y: number): Rig {
  if (!finaleKeys) {
    const start = rigToVec(poseToRig(divingPose(T_F0).pose));
    finaleKeys = [
      [T_F0, start],
      // startled: the torch is fumbled on, one arm flung out, legs thrashing as he starts to roll over
      [T_F0 + 0.5, mk(2.75, 0.25, 0.35, -0.25, [1.2, 0.25, 2.5, 0.2], [2.0, 0.9, 1.7, 0.9], [PI - 0.5, 0.25, PI - 1.0, 0.1], [PI + 0.45, -0.3, PI + 0.9, -0.2])],
      [T_F0 + 1.0, mk(1.45, 0.5, 0.5, 0.1, [1.9, 0.2, 1.7, 0.1], [1.5, 0.95, 1.4, 1.0], [PI - 0.35, 0.2, PI - 0.7, 0], [PI + 0.3, -0.2, PI + 0.6, 0])],
      // upright, and looking about: left, right, up, the light chasing his eyes
      [T_F0 + 1.5, mk(0.1, 0.65, 0.6, 0.05, [1.25, 0.3, 1.15, 0.2], [1.2, 0.85, 1.0, 0.9], ...LEGS_DOWN)],
      [T_F0 + 1.85, mk(0.04, 1.25, -0.55, 0.12, [1.95, 0.55, 2.0, 0.5], [0.9, 0.9, 0.8, 0.9], ...LEGS_DOWN)],
      [T_F0 + 2.2, mk(0.1, 0.8, 0.6, -0.05, [0.95, 0.1, 0.85, 0], [1.0, 0.8, 0.9, 0.8], ...LEGS_DOWN)],
      [T_F0 + 2.5, mk(0.05, 1.25, -0.25, -0.18, [1.5, 0.4, 1.35, 0.3], [1.1, 0.8, 1.0, 0.8], ...LEGS_DOWN)],
      // he sees us: turns square, raises the torch, and points it at the screen
      [T_FACE, mk(0.03, PI / 2, 0, 0, [1.5, 0.12, 1.5, 0.05], [1.9, 0.7, 1.8, 0.7], ...LEGS_DOWN)],
      [T_FACE + 0.4, mk(0.02, PI / 2, 0, 0, [1.5, 0.04, PI / 2, 0], [2.0, 0.65, 1.9, 0.6], ...LEGS_DOWN)],
      [T_FACE + 6, mk(0.02, PI / 2, 0, 0, [1.5, 0.04, PI / 2, 0], [2.0, 0.65, 1.9, 0.6], ...LEGS_DOWN)],
    ];
  }
  const v = spline(finaleKeys, t);
  const panic = 1 - 0.55 * smooth((t - T_F0 - 1.2) / 0.6), w = t * 7.4;
  v[12] += Math.sin(w) * 0.34 * panic; v[14] += Math.sin(w - 1.1) * 0.46 * panic;
  v[16] += Math.sin(w + PI) * 0.34 * panic; v[18] += Math.sin(w + PI - 1.1) * 0.46 * panic;
  const settled = t > T_F0 + 1.3 ? 1 : 0;
  v[0] += Math.sin(t * 2.3) * 0.025 * settled;
  return vecToRig(v, x, y + settled * Math.sin(t * 1.6) * 3);
}

/* ---------------------------------------------------------------- the sea life, laid out once */

const REEF = Array.from({ length: 2 }, (_, side) => Array.from({ length: 26 }, (_, i) => ({
  side: side ? 1 : -1, y: 300 + i * 38 + hash(i * 3 + side * 50) * 24, kind: Math.floor(hash(i * 7 + side * 31) * 5),
  size: 0.8 + hash(i * 11 + side * 17) * 0.7, hue: Math.floor(hash(i * 13 + side * 5) * 6), seed: i * 5 + side * 97,
}))).flat();
const CORAL = ["#ff5a7a", "#ff9a2a", "#b45cff", "#ffd23a", "#3ee0b0", "#ff6a3a"];
const SCHOOLS = [
  { y: 520, kind: "tang", n: 9, size: 30, vx: -46, spread: 120 }, { y: 690, kind: "chromis", n: 14, size: 17, vx: 62, spread: 90 },
  { y: 880, kind: "butterfly", n: 7, size: 26, vx: -34, spread: 100 }, { y: 400, kind: "chromis", n: 12, size: 16, vx: -70, spread: 80 },
];
const LONERS = Array.from({ length: 14 }, (_, i) => ({
  y: 260 + i * 64 + hash(i) * 30, kind: ["angel", "parrot", "coral", "tang", "butterfly"][i % 5],
  size: 34 + hash(i + 5) * 22, vx: (hash(i + 9) > 0.5 ? 1 : -1) * (18 + hash(i + 3) * 26), base: hash(i + 21) * 2 - 1,
}));
const wrap = (base: number, v: number, t: number, span: number) => { const m = 2 * span; return CX + ((((base * span + v * t) % m) + m) % m) - span; };

let grain: CanvasPattern | null = null;
const grainPattern = (c: Ctx) => {
  if (grain || typeof document === "undefined") return grain;
  const tile = document.createElement("canvas"); tile.width = tile.height = 128;
  const g = tile.getContext("2d");
  if (!g) return null;
  const img = g.createImageData(128, 128);
  for (let i = 0; i < img.data.length; i += 4) { const v = hash(i * 0.37) > 0.5 ? 255 : 0; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 2 + hash(i * 0.91) * 9; }
  g.putImageData(img, 0, 0);
  grain = c.createPattern(tile, "repeat");
  return grain;
};

/* ---------------------------------------------------------------- the frame */

export function drawScene(c: Ctx, W: number, H: number, t: number): { depthM: number; focus: V } {
  const u0 = Math.min(H / 780, W / 600);
  const halfW = W / (2 * u0), halfH = H / (2 * u0);
  const off = sOffAt(t);
  const dv = diverPos(t);

  // the camera: still on the surface, then it takes up the dive, and at the end pushes in on his face
  const dolly = smooth((t - T_FACE) / 0.8);
  const u = u0 * (1 + 0.85 * dolly);
  const camSurf = -0.1 * H / u0, camDiver = Math.max(0, dv.y) + lerp(0.1, 0.03, dolly) * H / u;
  const follow = smooth((t - (T_ENTRY - 0.1)) / 0.9);
  const camY = lerp(camSurf, Math.max(camSurf, camDiver), follow);
  const camX = lerp(0, CX, smooth((t - (T_ENTRY - 0.2)) / 1.6)) + lerp(0, 22, dolly);
  const shakeK = t < T_ENTRY ? 1.2 : 0.5;
  const swayX = Math.sin(t * 1.3) * shakeK, swayY = Math.sin(t * 1.7 + 1) * shakeK;
  const xin = HIP0[0] + VX * (T_ENTRY - T_LEAP);
  const wy = (x: number) => waveY(x, t, off, t > T_ENTRY ? 1 : 0, xin);
  const x0 = camX - halfW - 40, x1 = camX + halfW + 40, y0 = camY - halfH - 40, y1 = camY + halfH + 40;
  const world = () => { c.save(); c.translate(W / 2 + swayX, H / 2 + swayY); c.scale(u, u); c.translate(-camX, -camY); };

  c.setTransform(1, 0, 0, 1, 0, 0);
  c.clearRect(0, 0, W, H);
  world();
  const surfaceVisible = y0 < 200;
  if (surfaceVisible) drawAbove(c, t, off, x0, x1, y0, halfW, wy);
  drawBelow(c, t, off, x0, x1, y1, camX, camY, halfW, halfH, wy);
  if (y0 < 150) drawBoat(c, t, off, wy);

  // water-tint over the part of the boat below the waterline, then the bright skin of the surface
  if (surfaceVisible) {
    const tint = c.createLinearGradient(0, 0, 0, 70);
    tint.addColorStop(0, "rgba(34,196,204,.52)"); tint.addColorStop(1, "rgba(14,140,190,0)");
    c.fillStyle = tint; c.beginPath(); c.moveTo(x0, wy(x0));
    for (let x = x0; x <= x1; x += 8) c.lineTo(x, wy(x));
    c.lineTo(x1, 70); c.lineTo(x0, 70); c.closePath(); c.fill();
    drawSkin(c, t, off, camX, x0, x1, wy);
  }
  drawLife(c, t, camX, camY, halfW, halfH, y0, y1);
  drawBubbles(c, t, y0, y1);
  if (t > T_ENTRY - 0.05) drawSplash(c, t, xin, wy);
  c.restore();

  drawSnow(c, t, W, H, camY, u);

  // the dark: below the reef the light gives out altogether
  const dark = smooth((dv.y - 700) / 1500) * 0.93;
  if (dark > 0) { c.fillStyle = `rgba(0,4,12,${dark})`; c.fillRect(0, 0, W, H); }

  // what lives in the dark glows on its own, and the diver is drawn last, lit only by his own torch
  world();
  if (dv.y > 1100) drawDeep(c, t, halfW, halfH, camY, dark);
  const torch = drawDiver(c, t, wy);
  c.restore();
  drawFilm(c, t, W, H, dark);

  const focus: V = torch ? [W / 2 + swayX + (torch[0] - camX) * u, H / 2 + swayY + (torch[1] - camY) * u] : [W / 2, H / 2];
  return { depthM: Math.max(0, dv.y) / DEPTH_UNITS_PER_METRE, focus };
}

/* ---------------------------------------------------------------- above the water */

function drawAbove(c: Ctx, t: number, off: number, x0: number, x1: number, y0: number, halfW: number, wy: (x: number) => number) {
  const HZ = -70;
  // sky
  const sky = c.createLinearGradient(0, -980, 0, HZ);
  sky.addColorStop(0, "#1a78d2"); sky.addColorStop(0.45, "#40a6ea"); sky.addColorStop(0.78, "#9ddcf2"); sky.addColorStop(0.93, "#d9f2ee"); sky.addColorStop(1, "#fbecc8");
  c.fillStyle = sky; c.fillRect(x0, Math.min(y0, -980), x1 - x0, HZ - Math.min(y0, -980) + 1);

  const sunX = Math.min(330, halfW * 0.62), sunY = -330;
  sun(c, sunX, sunY, 34, t);
  // shafts of sunlight fanning through the haze, and the sun's ghosts along the line to the middle of the frame
  c.save(); c.globalCompositeOperation = "lighter";
  for (let i = 0; i < 7; i++) {
    const a = 2.15 + i * 0.27 + Math.sin(t * 0.3 + i) * 0.025, v1 = dir(a - 0.05), v2 = dir(a + 0.05);
    const g = c.createRadialGradient(sunX, sunY, 30, sunX, sunY, 820); g.addColorStop(0, "rgba(255,240,200,.065)"); g.addColorStop(1, "rgba(255,240,200,0)");
    c.fillStyle = g; c.beginPath(); c.moveTo(sunX, sunY); c.lineTo(sunX + v1[0] * 820, sunY + v1[1] * 820); c.lineTo(sunX + v2[0] * 820, sunY + v2[1] * 820); c.fill();
  }
  for (const [k, r, a] of [[0.35, 26, 0.1], [0.6, 14, 0.12], [0.85, 40, 0.07], [1.25, 20, 0.09]] as const) {
    const fx = lerp(sunX, 0, k), fy = lerp(sunY, -120, k);
    const g = c.createRadialGradient(fx, fy, 0, fx, fy, r); g.addColorStop(0, `rgba(255,236,190,${a})`); g.addColorStop(0.8, `rgba(255,200,140,${a * 0.6})`); g.addColorStop(1, "rgba(255,200,140,0)");
    c.fillStyle = g; c.beginPath(); c.arc(fx, fy, r, 0, TAU); c.fill();
  }
  c.restore();

  // high thin cloud, then the big drifting banks
  c.fillStyle = "rgba(255,255,255,.28)";
  for (let i = 0; i < 5; i++) { const px = ((hash(i) * 1400 - 700 + t * (5 + i * 2) + 2800) % 1400) - 700; c.beginPath(); c.ellipse(px, -520 + i * 34, 180 + hash(i + 4) * 120, 6 + hash(i + 8) * 4, -0.02, 0, TAU); c.fill(); }
  const bank = (i: number, y: number, s: number, v: number, a: number) => {
    const px = ((hash(i * 3) * 1500 - 750 + t * v + 3000) % 1500) - 750;
    cloud(c, px, y, s, i * 7, "#ffffff", "#bcdcf2", a);
  };
  bank(1, -430, 1.5, 7, 0.95); bank(2, -250, 1.2, 10, 0.95); bank(3, -150, 0.9, 14, 0.9); bank(4, -330, 1.0, 5, 0.85); bank(5, -120, 0.6, 17, 0.85);

  // the island on the horizon: hazy far ridge, near hill with palms and a hut
  const ix = -170 - off * 60;
  const ridge = (cx: number, w: number, h: number, col: string) => {
    c.fillStyle = col; c.beginPath(); c.moveTo(cx - w, HZ + 2);
    c.bezierCurveTo(cx - w * 0.6, HZ - h * 0.2, cx - w * 0.35, HZ - h * 1.05, cx - w * 0.05, HZ - h * 0.9);
    c.bezierCurveTo(cx + w * 0.2, HZ - h * 1.0, cx + w * 0.55, HZ - h * 0.3, cx + w, HZ + 2); c.fill();
  };
  ridge(ix - 150, 260, 80, "rgba(150,196,200,.75)"); ridge(ix + 260, 200, 52, "rgba(160,204,206,.75)"); ridge(ix + 520 + 220, 140, 34, "rgba(170,210,210,.7)");
  ridge(ix, 190, 62, "#2f8f6a");
  c.fillStyle = "#1f6e55"; c.beginPath(); c.moveTo(ix - 120, HZ + 2); c.bezierCurveTo(ix - 70, HZ - 30, ix - 20, HZ - 44, ix + 20, HZ - 38); c.bezierCurveTo(ix + 70, HZ - 30, ix + 120, HZ - 14, ix + 160, HZ + 2); c.fill();
  c.fillStyle = "#f2dca0"; c.beginPath(); c.moveTo(ix - 190, HZ + 2); c.quadraticCurveTo(ix, HZ - 6, ix + 190, HZ + 2); c.lineTo(ix + 190, HZ + 4); c.lineTo(ix - 190, HZ + 4); c.fill();
  for (const [dx, h, lean, seed] of [[-96, 50, 0.22, 1], [-72, 66, -0.12, 2], [-48, 44, 0.15, 3], [12, 58, -0.2, 4], [52, 40, 0.1, 5], [92, 54, 0.18, 6]] as const)
    palm(c, ix + dx, HZ - 14 + Math.sin(dx) * 4, h, lean, t, seed, "#14473a", "#1f7a55");
  c.fillStyle = "#8b6a3c"; c.beginPath(); c.moveTo(ix + 118, HZ - 8); c.lineTo(ix + 130, HZ - 20); c.lineTo(ix + 142, HZ - 8); c.fill();
  c.fillStyle = "#4a3320"; c.fillRect(ix + 122, HZ - 8, 16, 7);

  // a haze that melts the island into the sky
  const haze = c.createLinearGradient(0, HZ - 90, 0, HZ + 8);
  haze.addColorStop(0, "rgba(255,244,214,0)"); haze.addColorStop(1, "rgba(255,244,214,.55)");
  c.fillStyle = haze; c.fillRect(x0, HZ - 90, x1 - x0, 98);

  // a far sailboat
  const sbx = 150 - off * 24;
  c.fillStyle = "#fffdf4"; c.beginPath(); c.moveTo(sbx, HZ - 18); c.lineTo(sbx, HZ - 1); c.lineTo(sbx + 11, HZ - 1); c.fill();
  c.fillStyle = "#e9e1c8"; c.beginPath(); c.moveTo(sbx - 2, HZ - 14); c.lineTo(sbx - 2, HZ - 1); c.lineTo(sbx - 8, HZ - 1); c.fill();
  c.fillStyle = "#33414d"; c.fillRect(sbx - 9, HZ - 1, 22, 2.4);

  // the sea between the horizon and the boat
  const sea = c.createLinearGradient(0, HZ, 0, 12);
  sea.addColorStop(0, "#bfeee8"); sea.addColorStop(0.35, "#5fd8d2"); sea.addColorStop(1, "#1fb8c6");
  c.fillStyle = sea; c.fillRect(x0, HZ, x1 - x0, 90);
  const gl = c.createLinearGradient(0, HZ, 0, 12); gl.addColorStop(0, "rgba(255,240,200,.55)"); gl.addColorStop(1, "rgba(255,240,200,0)");
  c.fillStyle = gl; c.fillRect(sunX - 160, HZ, 320, 80);
  // swell running away in perspective: each row a lit crest over a shaded trough
  for (let i = 0; i < 15; i++) {
    const f = (i + 0.5) / 15, y = HZ + Math.pow(f, 1.8) * 78 + 2, amp = 0.5 + f * 3.2, k = 0.035 / (0.25 + f * 1.3), ph = i * 2 + off * SCROLL * f * 0.7 * k;
    c.fillStyle = `rgba(6,96,128,${0.05 + f * 0.1})`; c.beginPath(); c.moveTo(x0, y + 2 + f * 5);
    for (let x = x0; x <= x1; x += 14) c.lineTo(x, y + 2 + f * 5 + Math.sin(x * k + ph) * amp);
    for (let x = x1; x >= x0; x -= 14) c.lineTo(x, y + Math.sin(x * k + ph) * amp);
    c.fill();
    c.strokeStyle = `rgba(255,255,255,${0.14 + f * 0.3})`; c.lineWidth = 0.8 + f * 1.8; c.beginPath();
    for (let x = x0; x <= x1; x += 14) { const yy = y + Math.sin(x * k + ph) * amp; if (x === x0) c.moveTo(x, yy); else c.lineTo(x, yy); }
    c.stroke();
  }
  // sun glitter on the water
  for (let i = 0; i < 90; i++) {
    const f = hash(i * 3.1), y = HZ + 3 + f * f * 72, persp = 0.25 + f * 1.6;
    const x = sunX + (hash(i * 5.3) - 0.5) * 70 * persp * (1 + f), flick = Math.max(0, Math.sin(t * (3 + hash(i) * 5) + i));
    c.fillStyle = `rgba(255,252,230,${flick * (0.9 - f * 0.2)})`; c.fillRect(x, y, 3 + 11 * persp * hash(i + 7), 0.9 + f * 1.1);
  }
  // gulls
  for (let i = 0; i < 4; i++) {
    const gx = ((hash(i + 30) * 1000 - 500 + t * (22 + i * 9) + 2000) % 1000) - 500, gy = -330 + i * 52 + Math.sin(t * 0.8 + i) * 12;
    gull(c, gx - 120, gy, 0.7 + hash(i) * 0.5, t, i * 1.7);
  }
}

/* ---------------------------------------------------------------- the boat */

function drawBoat(c: Ctx, t: number, off: number, wy: (x: number) => number) {
  const bob = wy(0) * 0.7 + Math.sin(t * 1.9) * 2;
  const pitch = Math.atan2(wy(-130) - wy(130), 260) * 0.8 + Math.sin(t * 1.6) * 0.02;
  // rowing: a stroke every 1.3s, easing off as the boat glides. Each drive surges the boat forward and lifts the bow.
  const cyc = rowPhaseAt(t) % 1, drive = ROW;
  const pulse = cyc < drive ? Math.sin((Math.PI * cyc) / drive) : 0;
  const speed = glideAt(t) * (0.5 + 0.95 * pulse);
  const surge = (pulse - 0.45) * 7 * glideAt(t) * (1 - smooth((t - (T_LEAP - 0.5)) / 0.4));
  c.save(); c.translate(surge, -10 + bob); c.rotate(-pitch - pulse * 0.014 * glideAt(t));

  const e = (v: number) => v * v * (3 - 2 * v);
  const O: V = [-30, -31];
  let tipX: number, tipY: number;
  if (cyc < drive) { const q = cyc / drive; tipX = lerp(125, -125, e(q)); tipY = 12 + Math.sin(q * Math.PI) * 5; }
  else { const q = (cyc - drive) / (1 - drive); tipX = lerp(-125, 125, e(q)); tipY = 12 - Math.sin(Math.min(1, q * 1.15) * Math.PI) * 36; }
  const tip: V = [O[0] + tipX, tipY]; // blade tip, in boat space
  const handle: V = [O[0] - (tip[0] - O[0]) * 0.29, O[1] - (tip[1] - O[1]) * 0.29];
  const lean = lerp(-0.85, 0.3, cyc < drive ? e(cyc / drive) : 1 - e((cyc - drive) / (1 - drive)));

  // the rower: hip on the thwart, facing the stern
  const hip: V = [22, -34];
  const leg = lerp(1, 0, cyc < drive ? e(cyc / drive) : 1 - e((cyc - drive) / (1 - drive)));
  const rowerPose: Pose = { x: hip[0], y: hip[1], torso: lean, head: -0.05, lu: 0, lf: 0, ru: 0, rf: 0, lt: 0, ls: 0, rt: 0, rs: 0, facing: -1 };
  const j = fk(rowerPose);
  const foot: V = [hip[0] - 54 - leg * 12, -3];
  const kn = reach(hip[0], hip[1], foot[0], foot[1], 31, 30, -1);
  j.knL = kn.mid; j.foL = kn.end; j.knR = kn.mid; j.foR = kn.end; j.toeL = [kn.end[0] - 10, kn.end[1] + 1]; j.toeR = j.toeL;
  const arm = reach(j.sh[0], j.sh[1], handle[0], handle[1], 26, 24, 1);
  j.elR = arm.mid; j.haR = arm.end; j.elL = arm.mid; j.haL = arm.end;

  // the far oar sits behind the hull, the near one in front
  oar(c, [O[0] + 2, O[1] + 1], [tip[0] + 6, tip[1] - 3], [handle[0] + 4, handle[1] - 2]);
  person(c, j, rowerLook);
  // the diver waits on the bow until he leaps
  if (t < T_LEAP + 0.16) {
    const k = standingPose(t);
    const p = toPose(k, HIP0[0], -111);
    person(c, fk(p), diverLook);
  }
  boatHull(c, t);
  c.fillStyle = "rgba(0,50,70,.26)"; c.beginPath(); c.ellipse(0, 20, 205, 8, 0, 0, TAU); c.fill();
  oar(c, O, tip, handle);
  c.fillStyle = css(hex("#d9a273")); c.beginPath(); c.arc(j.haR[0], j.haR[1], 4.4, 0, TAU); c.fill();
  // foam where the hull meets the sea
  c.strokeStyle = "rgba(255,255,255,.85)"; c.lineWidth = 2.2; c.lineCap = "round"; c.beginPath();
  for (let x = -220; x <= 214; x += 10) { const y = 10 + Math.sin(x * 0.07 + t * 3) * 1.4 + (x - 100) * (x > 150 ? -0.08 : 0); if (x === -220) c.moveTo(x, y); else c.lineTo(x, y); }
  c.stroke();
  // the bow wave, and the splash where the blade bites and leaves the water
  const bowK = clamp(speed / 1.3);
  c.fillStyle = `rgba(255,255,255,${0.75 * bowK})`;
  for (let i = 0; i < 6; i++) { const a = (t * 2.6 + i / 6) % 1; c.beginPath(); c.ellipse(212 + a * 26, 10 - a * 8 + Math.sin(i) * 2, 9 - a * 6 + bowK * 4, 3.2 - a * 2, 0, 0, TAU); c.fill(); }
  const bite = cyc < 0.14 ? cyc * 1.3 : cyc >= drive && cyc < drive + 0.14 ? (cyc - drive) * 1.3 : -1;
  if (bite >= 0) {
    for (let i = 0; i < 9; i++) {
      const vx = (hash(i * 3.1 + Math.floor(cyc < 0.5 ? 0 : 1)) - 0.5) * 150, vy = -70 - hash(i * 5.3) * 120;
      const x = tip[0] + vx * bite, y = 10 + vy * bite + 0.5 * 700 * bite * bite;
      if (y > 12) continue;
      c.fillStyle = `rgba(250,255,255,${0.9 * (1 - bite / 0.18)})`; c.beginPath(); c.arc(x, y, 1.6 + hash(i) * 1.8, 0, TAU); c.fill();
    }
  }
  c.restore();
  void off;
}

/* ---------------------------------------------------------------- the surface as a skin */

function drawSkin(c: Ctx, t: number, off: number, camX: number, x0: number, x1: number, wy: (x: number) => number) {
  // the white crest line
  c.strokeStyle = "rgba(236,255,252,.85)"; c.lineWidth = 2; c.beginPath();
  for (let x = x0; x <= x1; x += 6) { const y = wy(x); if (x === x0) c.moveTo(x, y); else c.lineTo(x, y); }
  c.stroke();
  c.strokeStyle = "rgba(255,255,255,.22)"; c.lineWidth = 4; c.beginPath();
  for (let x = x0; x <= x1; x += 6) { const y = wy(x) + 5 + Math.sin(x * 0.03 + t) * 1.2; if (x === x0) c.moveTo(x, y); else c.lineTo(x, y); }
  c.stroke();
  // water streaming past the hull: short bright streaks racing towards the stern
  const glide = glideAt(t);
  c.lineCap = "round";
  for (let i = 0; i < 34; i++) {
    const sp = 0.55 + hash(i * 2.3) * 0.9, span = 1500;
    const x = camX + ((((hash(i * 1.7) * span - off * SCROLL * sp) % span) + span) % span) - span / 2;
    const y = wy(x) + 6 + hash(i * 4.1) * 40, len = 14 + hash(i + 8) * 46 * (0.4 + glide);
    c.strokeStyle = `rgba(240,255,252,${(0.12 + 0.2 * hash(i + 3)) * (0.5 + glide * 0.5)})`; c.lineWidth = 1.4 + hash(i) * 1.4;
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + len, y + Math.sin(x * 0.05 + i) * 0.8); c.stroke();
  }
  // a swirl left in the water by each stroke, drifting astern
  for (const st of STROKES) {
    const age = t - st.t; if (age < 0 || age > 2.2) continue;
    const x = -30 - (off - st.off) * SCROLL, y = wy(x) + 4, a = 1 - age / 2.2;
    c.strokeStyle = `rgba(245,255,252,${0.75 * a})`; c.lineWidth = 2;
    c.beginPath(); c.ellipse(x, y, 10 + age * 26, 1.8 + age * 2.2, 0, 0, TAU); c.stroke();
    c.strokeStyle = `rgba(245,255,252,${0.4 * a})`; c.beginPath(); c.ellipse(x - 14, y + 1, 5 + age * 15, 1 + age * 1.3, 0, 0, TAU); c.stroke();
  }
  // foam trailing the stern
  for (let i = 0; i < 12; i++) {
    const a = (hash(i) + off * 0.9 * (0.8 + hash(i + 3) * 0.4)) % 1, x = -222 - a * 460, y = wy(x) + 2 + hash(i * 7) * 7;
    c.fillStyle = `rgba(255,255,255,${(1 - a) * 0.55 * (0.3 + glide * 0.7)})`; c.beginPath(); c.ellipse(x, y, 14 + a * 26, 1.7, 0, 0, TAU); c.fill();
  }
}

/* ---------------------------------------------------------------- below the water */

function drawBelow(c: Ctx, t: number, off: number, x0: number, x1: number, y1: number, camX: number, camY: number, halfW: number, halfH: number, wy: (x: number) => number) {
  const bottom = RAMP_STOPS[RAMP_STOPS.length - 1][0];
  const g = c.createLinearGradient(0, 0, 0, bottom);
  for (const [d, col] of RAMP_STOPS) g.addColorStop(d / bottom, css(col));
  c.fillStyle = g; c.beginPath(); c.moveTo(x0, wy(x0));
  for (let x = x0; x <= x1; x += 8) c.lineTo(x, wy(x));
  c.lineTo(x1, y1 + 60); c.lineTo(x0, y1 + 60); c.closePath(); c.fill();

  // shafts of light falling from the surface
  c.save(); c.globalCompositeOperation = "lighter";
  for (let i = 0; i < 9; i++) {
    const bx = camX + (hash(i * 3) - 0.5) * halfW * 2.6 + Math.sin(t * 0.4 + i) * 24, w = 22 + hash(i + 8) * 40, skew = 0.32 + Math.sin(t * 0.25 + i) * 0.04;
    const sg = c.createLinearGradient(0, 0, 0, 1000); sg.addColorStop(0, `rgba(190,255,245,${0.1 + hash(i) * 0.05})`); sg.addColorStop(0.5, "rgba(120,220,235,.07)"); sg.addColorStop(1, "rgba(120,220,235,0)");
    c.fillStyle = sg;
    for (const k of [1, 0.66, 0.36]) { c.beginPath(); c.moveTo(bx - w * k, 0); c.lineTo(bx + w * k, 0); c.lineTo(bx + w * k * 2.8 + skew * 1000, 1000); c.lineTo(bx - w * k * 2.8 + skew * 1000, 1000); c.fill(); }
  }
  // caustics: bright tangles of light on the shallows
  for (let i = 0; i < 46; i++) {
    const cx = camX + (hash(i * 1.3) - 0.5) * halfW * 2.4 + Math.sin(t * 0.8 + i) * 12, cy = 10 + hash(i * 2.7) * 250;
    const a = (1 - cy / 270) * 0.34 * (0.6 + 0.4 * Math.sin(t * 2 + i));
    c.strokeStyle = `rgba(220,255,250,${a})`; c.lineWidth = 1.6;
    c.beginPath(); c.ellipse(cx, cy, 14 + hash(i) * 22, 4 + hash(i + 3) * 7, Math.sin(t + i) * 0.4, 0.2, Math.PI * 1.5 + hash(i) * 0.8); c.stroke();
  }
  c.restore();

  // the reef: two walls closing in, each hung with coral
  if (y1 > 250) {
    const reefK = (y: number) => smooth((y - 250) / 230) * (1 - smooth((y - 1120) / 280));
    const edge = (side: number, y: number) => {
      const o = halfW * (0.88 + 0.09 * Math.sin(y * 0.0062 + side * 2) + 0.05 * Math.sin(y * 0.017 + side)) + (1 - reefK(y)) * halfW * 1.6;
      return CX + side * o;
    };
    for (const side of [-1, 1]) {
      const wall = c.createLinearGradient(0, 250, 0, 2000);
      wall.addColorStop(0, "#1c8a8c"); wall.addColorStop(0.35, "#116484"); wall.addColorStop(0.7, "#0a3a60"); wall.addColorStop(1, "#021424");
      c.fillStyle = wall; c.beginPath();
      const ya = Math.max(200, camY - halfH - 40), yb = camY + halfH + 40;
      c.moveTo(CX + side * halfW * 4, ya);
      for (let y = ya; y <= yb; y += 24) c.lineTo(edge(side, y), y);
      c.lineTo(CX + side * halfW * 4, yb); c.closePath(); c.fill();
      c.strokeStyle = "rgba(120,220,220,.22)"; c.lineWidth = 3; c.beginPath();
      for (let y = ya; y <= yb; y += 24) { if (y === ya) c.moveTo(edge(side, y), y); else c.lineTo(edge(side, y), y); }
      c.stroke();
    }
    for (const s of REEF) {
      if (s.y < camY - halfH - 140 || s.y > camY + halfH + 120) continue;
      const k = reefK(s.y); if (k < 0.04) continue;
      const bx = edge(s.side, s.y) + s.side * 4, by = s.y;
      const fog = clamp(s.y / 1500) * 0.8, sea = seaColour(s.y);
      const tintC = (h: string) => css(mixRGB(hex(h), sea, fog));
      const col = CORAL[s.hue], tip = CORAL[(s.hue + 2) % 6];
      c.save(); c.globalAlpha = k; c.translate(bx, by); c.scale(s.size, s.size); c.translate(-bx, -by);
      if (s.kind === 0) staghorn(c, bx, by, 46, -s.side * 0.9, 3, s.seed, tintC(col), tintC(tip), 5);
      else if (s.kind === 1) brain(c, bx - s.side * 26, by + 10, 34, tintC(col), tintC("#6a2a4a"));
      else if (s.kind === 2) seaFan(c, bx - s.side * 4, by + 16, 74, tintC(col), t, s.seed);
      else if (s.kind === 3) { tubeSponge(c, bx - s.side * 12, by + 12, 22, 58, tintC(col), tintC("#3a1030")); tubeSponge(c, bx - s.side * 34, by + 16, 15, 38, tintC(tip), tintC("#3a1030")); }
      else anemone(c, bx - s.side * 24, by + 10, 38, t, tintC("#ff6aa8"), tintC("#ffe0ef"));
      c.restore();
    }
  }
}

/* ---------------------------------------------------------------- creatures */

function drawLife(c: Ctx, t: number, camX: number, camY: number, halfW: number, halfH: number, y0: number, y1: number) {
  const water: RGB = [10, 110, 170];
  const tintAt = (y: number) => clamp(y / 1500) * 0.82;
  const wtr = (y: number) => seaColour(y);
  void water; void camX;
  for (const s of SCHOOLS) {
    if (s.y < y0 - 80 || s.y > y1 + 80) continue;
    const face = s.vx > 0 ? 1 : -1;
    for (let i = 0; i < s.n; i++) {
      const lead = i * 0.5, x = wrap(0, s.vx, t, halfW * 1.35) - face * (hash(i) * s.spread) - face * lead * 8;
      const y = s.y + Math.sin(t * 1.1 + i * 1.7) * 18 + (hash(i + 4) - 0.5) * s.spread * 0.9;
      fish(c, x, y, s.size * (0.85 + hash(i + 2) * 0.3), face, FISH[s.kind], t, i * 1.3, tintAt(y), wtr(y), Math.cos(t * 1.1 + i * 1.7) * 0.1);
    }
  }
  for (const f of LONERS) {
    if (f.y < y0 - 60 || f.y > y1 + 60) continue;
    const face = f.vx > 0 ? 1 : -1, x = wrap(f.base, f.vx, t, halfW * 1.3);
    fish(c, x, f.y + Math.sin(t * 0.9 + f.base * 9) * 14, f.size, face, FISH[f.kind], t, f.base * 7, tintAt(f.y), wtr(f.y), Math.sin(t + f.base * 4) * 0.08);
  }
  // clownfish playing in the anemones
  for (const s of REEF) {
    if (s.kind !== 4 || s.y < y0 - 60 || s.y > y1 + 60 || s.y < 320) continue;
    const bx = CX + s.side * halfW * 0.88 - s.side * 24, k = smooth((s.y - 250) / 230);
    if (k < 0.5) continue;
    fish(c, bx - s.side * 4 + Math.sin(t * 2 + s.seed) * 6, s.y - 26 + Math.sin(t * 1.4 + s.seed) * 5, 22, -s.side as 1 | -1, FISH.clown, t, s.seed, tintAt(s.y), wtr(s.y));
  }
  // the turtle, unhurried
  const ty = 760, tx = CX + halfW * 0.55 - (t - 4.6) * 38;
  if (ty > y0 - 120 && ty < y1 + 120) turtle(c, tx, ty + Math.sin(t * 1.1) * 10, 0.82, -1, t, tintAt(ty), wtr(ty));
  // jellyfish, glowing
  const jy = [980, 1070, 1150], jx = [-0.35, 0.45, -0.1];
  jy.forEach((y, i) => {
    if (y < y0 - 120 || y > y1 + 120) return;
    const glow = clamp((y - 800) / 300);
    jelly(c, CX + jx[i] * halfW + Math.sin(t * 0.5 + i) * 18, y + Math.sin(t * 0.8 + i * 2) * 26, 0.7 + i * 0.08, t, i * 2.2, i === 1 ? [255, 150, 210] : [150, 190, 255], 0.55 + glow * 0.3);
  });
  // the manta ray, high above the dark
  const my = 1130;
  if (my > y0 - 200 && my < y1 + 200) manta(c, CX - halfW * 0.9 + (t - 4.8) * 120, my + Math.sin(t * 0.7) * 14, 1.05, 1, t, [16, 64, 112], 0.9);
  void camY;
}

function drawBubbles(c: Ctx, t: number, y0: number, y1: number) {
  if (t < T_ENTRY) return;
  c.lineWidth = 1.2;
  const bubble = (x: number, y: number, r: number, a: number) => {
    if (y < y0 - 20 || y > y1 + 20 || a <= 0.01) return;
    c.strokeStyle = `rgba(235,255,255,${a})`; c.fillStyle = `rgba(190,240,255,${a * 0.18})`;
    c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); c.stroke();
    c.fillStyle = `rgba(255,255,255,${a * 0.9})`; c.beginPath(); c.arc(x - r * 0.32, y - r * 0.32, r * 0.22, 0, TAU); c.fill();
  };
  // the trail he leaves
  for (let i = 0; i < 190; i++) {
    const ts = T_ENTRY + 0.05 + i * 0.038, age = t - ts;
    if (age < 0 || age > 3.2) continue;
    const p = diverPos(ts);
    if (p.y < 30) continue;
    const r = 1.8 + hash(i * 1.7) * 5.5, rise = age * (30 + r * 7);
    bubble(p.x + (hash(i * 2.9) - 0.5) * 40 + Math.sin(age * 3 + i) * 6, p.y + 40 - rise, r, 0.8 * (1 - age / 3.2));
  }
  // the burst at the entry
  const xin = HIP0[0] + VX * (T_ENTRY - T_LEAP);
  for (let i = 0; i < 70; i++) {
    const age = t - T_ENTRY - hash(i) * 0.25; if (age < 0 || age > 3) continue;
    const a = (hash(i * 3.3) - 0.5) * 1.6, sp = 60 + hash(i * 5.1) * 150, r = 2 + hash(i * 7.7) * 7;
    bubble(xin + Math.sin(a) * sp * Math.min(age, 0.7) + Math.sin(age * 4 + i) * 5, 4 + Math.cos(a) * sp * 0.9 * Math.min(age, 0.7) - Math.max(0, age - 0.7) * (46 + r * 6), r, 0.85 * (1 - age / 3));
  }
}

function drawDiver(c: Ctx, t: number, wy: (x: number) => number): V | null {
  if (t < T_LEAP + 0.16) return null; // before the leap he is part of the boat
  const { pose } = divingPose(t);
  const depth = Math.max(0, pose.y);
  const lamp = lampAt(t);
  const sea = seaColour(depth);
  const surf = wy(pose.x);
  const wet = (0.22 + clamp(depth / SINK) * 0.62) * (1 - lamp * 0.82);
  const rig = t < T_F0 ? poseToRig(pose) : finaleAt(t, pose.x, pose.y);
  let out;
  if (surf > pose.y - 260 && surf < pose.y + 260) {
    // the surface is cutting him: the dry part and the wet part are drawn separately
    const lo = pose.y - 320, hi = pose.y + 320;
    c.save(); c.beginPath(); c.rect(pose.x - 400, lo, 800, surf - lo); c.clip(); out = diverRig(c, rig, t, 0, sea, lamp); c.restore();
    c.save(); c.beginPath(); c.rect(pose.x - 400, surf, 800, hi - surf); c.clip(); out = diverRig(c, rig, t, wet, sea, lamp); c.restore();
  } else out = diverRig(c, rig, t, pose.y < surf ? 0 : wet, sea, lamp);

  if (lamp > 0) {
    // the torch: a cone along the way it points, and a bloom when it points at us
    const sl = Math.hypot(out.aim[0], out.aim[1]), facing = clamp(out.aim[2], 0, 1);
    if (sl > 0.08) beam(c, out.torch, Math.atan2(out.aim[0], -out.aim[1]), 900 * sl, 0.3, lamp * Math.min(1, sl * 1.4) * (1 - facing * 0.7));
    c.save(); c.globalCompositeOperation = "lighter";
    const g = c.createRadialGradient(pose.x, pose.y, 10, pose.x, pose.y, 380);
    g.addColorStop(0, `rgba(120,210,235,${0.22 * lamp})`); g.addColorStop(1, "rgba(60,150,200,0)");
    c.fillStyle = g; c.fillRect(pose.x - 380, pose.y - 380, 760, 760);
    const k = lamp * (0.15 + 0.85 * facing), R = 120 + 220 * facing;
    const bloom = c.createRadialGradient(out.torch[0], out.torch[1], 0, out.torch[0], out.torch[1], R);
    bloom.addColorStop(0, `rgba(255,252,236,${0.8 * k})`); bloom.addColorStop(0.08, `rgba(255,226,150,${0.4 * k})`); bloom.addColorStop(0.4, `rgba(255,190,90,${0.07 * k})`); bloom.addColorStop(1, "rgba(255,170,60,0)");
    c.fillStyle = bloom; c.fillRect(out.torch[0] - R, out.torch[1] - R, R * 2, R * 2);
    if (facing > 0.75) {
      const streak = c.createLinearGradient(out.torch[0] - 170, 0, out.torch[0] + 170, 0);
      streak.addColorStop(0, "rgba(255,210,120,0)"); streak.addColorStop(0.5, `rgba(255,236,190,${0.3 * k})`); streak.addColorStop(1, "rgba(255,210,120,0)");
      c.fillStyle = streak; c.fillRect(out.torch[0] - 170, out.torch[1] - 1, 340, 2);
    }
    c.restore();
  }
  return out.torch;
}

// the deep: jellyfish and plankton that make their own light, so the dark has something living in it
function drawDeep(c: Ctx, t: number, halfW: number, halfH: number, camY: number, dark: number) {
  c.save(); c.globalCompositeOperation = "lighter";
  const glow = clamp((dark - 0.1) / 0.5);
  const jy = [1300, 1420, 1540, 1680, 1820], jx = [0.5, -0.45, 0.1, -0.2, 0.42];
  jy.forEach((y, i) => {
    if (y < camY - halfH - 140 || y > camY + halfH + 140) return;
    jelly(c, CX + jx[i] * halfW + Math.sin(t * 0.5 + i * 1.3) * 22, y + Math.sin(t * 0.7 + i) * 24, 0.7 + (i % 3) * 0.14, t, i * 1.9 + 3, i % 2 ? [120, 210, 255] : [190, 140, 255], 0.5 * glow);
  });
  for (let i = 0; i < 170; i++) {
    const x = CX + (hash(i * 1.7) * 2 - 1) * halfW * 1.15 + Math.sin(t * 0.4 + i) * 10, y = 1250 + hash(i * 3.1) * 1300 + Math.sin(t * 0.6 + i * 2) * 8;
    if (y < camY - halfH - 10 || y > camY + halfH + 10) continue;
    const blink = Math.max(0, Math.sin(t * (1.2 + hash(i) * 2.4) + i * 5)), r = 1 + hash(i + 9) * 2.4;
    const col = hash(i + 3) > 0.7 ? "255,184,28" : hash(i + 5) > 0.5 ? "120,230,255" : "190,150,255";
    c.fillStyle = `rgba(${col},${(0.25 + blink * 0.6) * glow})`; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
    if (r > 2.2) { const g = c.createRadialGradient(x, y, 0, x, y, r * 6); g.addColorStop(0, `rgba(${col},${0.3 * blink * glow})`); g.addColorStop(1, `rgba(${col},0)`); c.fillStyle = g; c.beginPath(); c.arc(x, y, r * 6, 0, TAU); c.fill(); }
  }
  // his breath: quick bursts of bubbles from the mask while he panics, slowing as he settles
  for (let i = 0; i < 46; i++) {
    const ts = T_F0 + i * 0.1 * (1 + i * 0.012), age = t - ts;
    if (age < 0 || age > 2.6) continue;
    const p = diverPos(ts), r = 1.6 + hash(i * 2.3) * 3.6;
    c.strokeStyle = `rgba(210,245,255,${0.7 * (1 - age / 2.6)})`; c.lineWidth = 1.1;
    c.beginPath(); c.arc(p.x + Math.sin(age * 4 + i) * 7 + (hash(i) - 0.5) * 22, p.y - 62 - age * (38 + r * 8), r, 0, TAU); c.stroke();
  }
  // a shoal of lantern fish, each carrying a row of tiny lights
  for (let n = 0; n < 3; n++) {
    const y = 1700 + n * 260;
    if (y < camY - halfH - 60 || y > camY + halfH + 60) continue;
    for (let i = 0; i < 9; i++) {
      const x = wrap(0, (n % 2 ? 40 : -52), t + n * 3, halfW * 1.3) + i * 22 * (n % 2 ? -1 : 1), yy = y + Math.sin(t * 1.2 + i) * 14 + (i % 3) * 14;
      c.fillStyle = `rgba(150,235,255,${0.7 * glow})`;
      for (let k = 0; k < 4; k++) { c.beginPath(); c.arc(x - k * 3.4 * (n % 2 ? -1 : 1), yy + 1.4, 1.1, 0, TAU); c.fill(); }
      c.fillStyle = `rgba(255,200,90,${0.8 * glow})`; c.beginPath(); c.arc(x + 4 * (n % 2 ? -1 : 1), yy - 2, 1.5, 0, TAU); c.fill();
    }
  }
  c.restore();
}

/* ---------------------------------------------------------------- the entry */

function drawSplash(c: Ctx, t: number, xin: number, wy: (x: number) => number) {
  const a = t - T_ENTRY;
  if (a < 0) return;
  // rings spreading over the surface
  for (let i = 0; i < 3; i++) {
    const age = a - i * 0.22; if (age < 0 || age > 2) continue;
    c.strokeStyle = `rgba(245,255,252,${0.8 * (1 - age / 2)})`; c.lineWidth = 2.2 - i * 0.5;
    c.beginPath(); c.ellipse(xin, wy(xin) + 1, 14 + age * 150, 3 + age * 14, 0, 0, TAU); c.stroke();
  }
  // the crown: two sheets of water thrown up either side of him, collapsing
  const crown = clamp(a / 0.28) * (1 - smooth((a - 0.35) / 0.55));
  if (crown > 0.01) {
    for (const side of [-1, 1]) {
      const h = 210 * ease(a / 0.4) * (1 - smooth((a - 0.5) / 0.55)), w = 16 + a * 110;
      const g = c.createLinearGradient(0, -h, 0, 0); g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(0.35, `rgba(244,255,252,${0.85 * crown})`); g.addColorStop(1, `rgba(190,245,240,${0.5 * crown})`);
      c.fillStyle = g; c.beginPath(); c.moveTo(xin + side * 4, wy(xin));
      c.quadraticCurveTo(xin + side * (w * 0.5), -h * 0.9, xin + side * (w + 14 + a * 40), -h); c.quadraticCurveTo(xin + side * (w * 1.3), -h * 0.3, xin + side * (w + 26), wy(xin) + 2); c.closePath(); c.fill();
    }
    c.fillStyle = `rgba(255,255,255,${0.7 * crown})`; c.beginPath(); c.ellipse(xin, wy(xin), 46 + a * 190, 11, 0, 0, TAU); c.fill();
  }
  // drops thrown into the air
  for (let i = 0; i < 120; i++) {
    const delay = hash(i * 1.9) * 0.18, age = a - delay; if (age < 0 || age > 1.5) continue;
    const ang = (hash(i * 3.7) - 0.5) * 1.7, sp = 170 + hash(i * 5.3) * 380;
    const x = xin + Math.sin(ang) * sp * age + (hash(i) - 0.5) * 20, y = -Math.cos(ang) * sp * age + 0.5 * 1000 * age * age;
    if (y > wy(x) + 2) continue;
    const r = 1.8 + hash(i * 9.1) * 4.2;
    c.fillStyle = `rgba(250,255,255,${0.95 * (1 - age / 1.5)})`; c.beginPath(); c.ellipse(x, y, r, r * (1 + Math.min(1, Math.abs(1000 * age - Math.cos(ang) * sp) / 600)), 0, 0, TAU); c.fill();
  }
}

/* ---------------------------------------------------------------- the camera's own effects */

function drawSnow(c: Ctx, t: number, W: number, H: number, camY: number, u: number) {
  if (t < T_WATER - 0.3) return;
  const a0 = smooth((t - T_WATER) / 0.6);
  c.save();
  for (let i = 0; i < 90; i++) {
    const par = 0.5 + hash(i * 1.1) * 1.1, x = (hash(i * 2.3) * W + Math.sin(t * 0.6 + i) * 14 + W) % W;
    const y = (((hash(i * 3.7) * H * 1.2 - camY * u * par + t * 6) % (H * 1.2)) + H * 1.2) % (H * 1.2);
    const depthFade = 1 - clamp((camY - 1100) / 700) * 0.5;
    c.fillStyle = `rgba(215,245,255,${a0 * depthFade * (0.1 + 0.35 * hash(i + 5)) * (par / 1.6 + 0.3)})`;
    c.beginPath(); c.arc(x, y, 0.7 + par * 0.9, 0, TAU); c.fill();
  }
  c.restore();
}

function drawFilm(c: Ctx, t: number, W: number, H: number, dark: number) {
  // the vignette of a real lens
  const v = c.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.hypot(W, H) * 0.62);
  v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, `rgba(0,10,22,${0.42 + dark * 0.3})`);
  c.fillStyle = v; c.fillRect(0, 0, W, H);
  // sun-warmth on the opening shots
  const warm = (1 - smooth((t - 2.4) / 1.2)) * 0.1;
  if (warm > 0) { c.fillStyle = `rgba(255,170,70,${warm})`; c.fillRect(0, 0, W, H); }
  // the flash of the entry
  const fl = clamp(1 - Math.abs(t - T_ENTRY - 0.04) / 0.2);
  if (fl > 0) { c.fillStyle = `rgba(255,255,255,${fl * 0.4})`; c.fillRect(0, 0, W, H); }
  // 24-frames-a-second grain: one pattern fill, shifted a little each frame
  const pat = grainPattern(c);
  if (pat) {
    const f = Math.floor(t * 24);
    c.save(); c.translate(-Math.floor(hash(f) * 128), -Math.floor(hash(f + 7) * 128)); c.fillStyle = pat; c.fillRect(0, 0, W + 128, H + 128); c.restore();
  }
}
