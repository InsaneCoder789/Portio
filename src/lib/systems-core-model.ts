import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

/** Reference-inspired solid armor, not a box carrying a photograph. */
export function buildSystemsCore({ compact = false }: { compact?: boolean } = {}) {
  const core = new THREE.Group();
  const brushCanvas = document.createElement("canvas");
  brushCanvas.width = brushCanvas.height = 256;
  const context = brushCanvas.getContext("2d")!;
  context.fillStyle = "#b0b0b0";
  context.fillRect(0, 0, 256, 256);
  let seed = 41;
  for (let row = 0; row < 256; row++) {
    seed = (seed * 16807) % 2147483647;
    const gray = 135 + seed % 90;
    context.fillStyle = `rgb(${gray},${gray},${gray})`;
    context.fillRect(0, row, 256, 1);
  }
  const brush = new THREE.CanvasTexture(brushCanvas);
  brush.wrapS = brush.wrapT = THREE.RepeatWrapping;
  brush.repeat.set(2, 4);
  const silver = new THREE.MeshStandardMaterial({ color: 0xaeb0b3, metalness: 1, roughness: .43, roughnessMap: brush, bumpMap: brush, bumpScale: .004 });
  const graphite = new THREE.MeshStandardMaterial({ color: 0x30343a, metalness: .9, roughness: .36, roughnessMap: brush });
  const dark = new THREE.MeshStandardMaterial({ color: 0x111419, metalness: .7, roughness: .28 });
  const copper = new THREE.MeshStandardMaterial({ color: 0xb87943, metalness: 1, roughness: .28 });
  const amber = new THREE.MeshStandardMaterial({ color: 0xffb04a, emissive: 0xf58a14, emissiveIntensity: 1.3, metalness: .25, roughness: .24 });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x9b6832, metalness: .4, roughness: .12, clearcoat: 1, clearcoatRoughness: .08, transparent: true, opacity: .55 });
  const blue = new THREE.MeshStandardMaterial({ color: 0x79c8ee, emissive: 0x349ac8, emissiveIntensity: .9 });
  const energyCanvas = document.createElement("canvas");
  energyCanvas.width = energyCanvas.height = 256;
  const energyContext = energyCanvas.getContext("2d")!;
  const energyGradient = energyContext.createRadialGradient(148, 138, 3, 128, 128, 128);
  energyGradient.addColorStop(0, "#fff6dd");
  energyGradient.addColorStop(.13, "#ffcf78");
  energyGradient.addColorStop(.38, "#a75512");
  energyGradient.addColorStop(.75, "#3a2313");
  energyGradient.addColorStop(1, "#0e0d0b");
  energyContext.fillStyle = energyGradient;
  energyContext.fillRect(0, 0, 256, 256);
  energyContext.strokeStyle = "rgba(240,168,69,.24)";
  energyContext.lineWidth = 1;
  for (let ring = 0; ring < 7; ring++) {
    energyContext.beginPath();
    energyContext.ellipse(128, 128, 23 + ring * 14, 19 + ring * 14, ring * .21, .4 + ring, 4.3 + ring);
    energyContext.stroke();
  }
  const energyTexture = new THREE.CanvasTexture(energyCanvas);
  energyTexture.colorSpace = THREE.SRGBColorSpace;
  const energy = new THREE.MeshStandardMaterial({ map: energyTexture, emissiveMap: energyTexture, emissive: 0xffffff, emissiveIntensity: 1.2, roughness: .35 });
  const materials = [silver, graphite, dark, copper, amber, glass, blue, energy];
  core.add(new THREE.Mesh(new RoundedBoxGeometry(1.72, 1.72, 1.72, compact ? 3 : 5, .23), copper));
  core.add(new THREE.Mesh(new RoundedBoxGeometry(1.69, 1.69, 1.69, compact ? 3 : 5, .23), graphite));

  // Four curved armor sectors leave a circular recess and diagonal joints.
  const sector = new THREE.Shape();
  sector.moveTo(.105, .73);
  sector.lineTo(.55, .73);
  sector.quadraticCurveTo(.73, .73, .73, .55);
  sector.lineTo(.73, .105);
  sector.lineTo(.57, .105);
  sector.absarc(0, 0, .58, .182, 1.389, false);
  sector.lineTo(.105, .73);
  const sectorGeometry = new THREE.ExtrudeGeometry(sector, { depth: .045, bevelEnabled: true, bevelSegments: compact ? 2 : 3, steps: 1, bevelSize: .025, bevelThickness: .022, curveSegments: compact ? 8 : 16 });
  const sidePanelGeometry = new RoundedBoxGeometry(.99, .99, .08, compact ? 2 : 4, .13);
  const shoulderGeometry = new RoundedBoxGeometry(.98, .23, .12, compact ? 2 : 3, .07);
  const screwGeometry = new THREE.TorusGeometry(.034, .009, 8, 16);
  const socketGeometry = new THREE.CylinderGeometry(.027, .027, .013, 6);
  const orientations = [[0, 0], [0, Math.PI], [0, Math.PI / 2], [0, -Math.PI / 2], [-Math.PI / 2, 0], [Math.PI / 2, 0]];
  orientations.forEach(([x, y], index) => {
    const face = new THREE.Group();
    face.rotation.set(x, y, 0);
    for (let quadrant = 0; quadrant < 4; quadrant++) {
      const trim = new THREE.Mesh(sectorGeometry, copper);
      trim.scale.set(1.035, 1.035, .8);
      trim.rotation.z = quadrant * Math.PI / 2;
      trim.position.z = .81;
      const plate = new THREE.Mesh(sectorGeometry, silver);
      plate.rotation.z = quadrant * Math.PI / 2;
      plate.position.z = .842;
      face.add(trim, plate);
      const shoulder = new THREE.Mesh(shoulderGeometry, graphite);
      shoulder.position.set(0, .66, .865);
      const pivot = new THREE.Group();
      pivot.rotation.z = quadrant * Math.PI / 2;
      pivot.add(shoulder);
      face.add(pivot);
    }
    for (const sx of [-.57, .57]) for (const sy of [-.57, .57]) {
      const rim = new THREE.Mesh(screwGeometry, copper);
      rim.position.set(sx, sy, .913);
      const socket = new THREE.Mesh(socketGeometry, dark);
      socket.rotation.x = Math.PI / 2;
      socket.position.set(sx, sy, .91);
      face.add(rim, socket);
    }
    if (index === 0) {
      const backing = new THREE.Mesh(new THREE.CylinderGeometry(.55, .55, .06, 64), dark);
      backing.rotation.x = Math.PI / 2;
      backing.position.z = .85;
      face.add(backing);
      const rings: [number, number, THREE.Material, number][] = [[.48, .035, graphite, .89], [.42, .022, copper, .90], [.35, .012, amber, .915], [.30, .011, copper, .932]];
      rings.forEach(([radius, thickness, material, z]) => {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, thickness, compact ? 6 : 10, compact ? 32 : 64), material);
        ring.position.z = z;
        face.add(ring);
      });
      const toothGeometry = new THREE.BoxGeometry(.085, .055, .04);
      for (let tooth = 0; tooth < 12; tooth++) {
        const angle = tooth / 12 * Math.PI * 2;
        const segment = new THREE.Mesh(toothGeometry, tooth % 3 === 0 ? amber : copper);
        segment.position.set(Math.cos(angle) * .45, Math.sin(angle) * .45, .922);
        segment.rotation.z = angle + Math.PI / 2;
        face.add(segment);
      }
      const lensGeometry = new THREE.SphereGeometry(.29, compact ? 16 : 32, compact ? 12 : 24);
      const lens = new THREE.Mesh(lensGeometry, glass);
      lens.scale.z = .35;
      lens.position.z = .9;
      const nucleus = new THREE.Mesh(new THREE.CircleGeometry(.29, 64), energy);
      nucleus.position.z = .89;
      face.add(nucleus, lens);
      const coreLight = new THREE.PointLight(0xffa62d, .12, 1.2);
      coreLight.position.z = 1.02;
      face.add(coreLight);
    } else {
      const panel = new THREE.Mesh(sidePanelGeometry, index === 4 ? graphite : silver);
      panel.position.z = .856;
      face.add(panel);
      if (index === 2) {
        const inset = new THREE.Mesh(new RoundedBoxGeometry(.105, .46, .025, 3, .035), dark);
        inset.position.set(-.52, 0, .926);
        const indicator = new THREE.Mesh(new RoundedBoxGeometry(.027, .32, .022, 2, .012), blue);
        indicator.position.set(-.52, 0, .945);
        face.add(inset, indicator);
      }
    }
    core.add(face);
  });
  // Bake the stationary armor into one mesh per material, not hundreds of draw calls.
  core.updateMatrixWorld(true);
  const batches = new Map<THREE.Material, THREE.BufferGeometry[]>();
  const sourceGeometries = new Set<THREE.BufferGeometry>();
  const lights: THREE.PointLight[] = [];
  core.traverse(object => {
    if (object instanceof THREE.Mesh) {
      sourceGeometries.add(object.geometry);
      const geometry = object.geometry.index ? object.geometry.toNonIndexed() : object.geometry.clone();
      geometry.applyMatrix4(object.matrixWorld);
      const material = object.material as THREE.Material;
      const batch = batches.get(material) ?? [];
      batch.push(geometry);
      batches.set(material, batch);
    } else if (object instanceof THREE.PointLight) {
      const lightCopy = object.clone();
      object.getWorldPosition(lightCopy.position);
      lights.push(lightCopy);
    }
  });
  core.clear();
  batches.forEach((geometries, material) => {
    const merged = mergeGeometries(geometries);
    if (merged) {
      core.add(new THREE.Mesh(merged, material));
      geometries.forEach(geometry => geometry.dispose());
    } else geometries.forEach(geometry => core.add(new THREE.Mesh(geometry, material)));
  });
  sourceGeometries.forEach(geometry => geometry.dispose());
  lights.forEach(lightCopy => core.add(lightCopy));
  return { core, disposeMaterials: () => { materials.forEach(material => material.dispose()); brush.dispose(); energyTexture.dispose(); } };
}
