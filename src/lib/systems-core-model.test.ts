// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import * as THREE from "three";
import { buildSystemsCore } from "./systems-core-model";

afterEach(() => vi.restoreAllMocks());

describe("reference-inspired systems core", () => {
  it("batches solid, finite geometry into at most eight material meshes", () => {
    const drawing = { fillStyle: "", strokeStyle: "", lineWidth: 1, fillRect: vi.fn(), beginPath: vi.fn(), ellipse: vi.fn(), stroke: vi.fn(), createRadialGradient: () => ({ addColorStop: vi.fn() }) };
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(drawing as unknown as CanvasRenderingContext2D);
    const { core, disposeMaterials } = buildSystemsCore();
    const meshes = core.children.filter((child): child is THREE.Mesh => child instanceof THREE.Mesh);
    expect(meshes.length).toBeGreaterThan(1);
    expect(meshes.length).toBeLessThanOrEqual(8);
    meshes.forEach(mesh => {
      expect(Array.from(mesh.geometry.getAttribute("position").array).every(Number.isFinite)).toBe(true);
      expect(mesh.geometry.getAttribute("normal").count).toBeGreaterThan(0);
    });
    const size = new THREE.Box3().setFromObject(core).getSize(new THREE.Vector3());
    expect(size.x).toBeGreaterThan(1.6);
    expect(Math.max(size.x, size.y, size.z)).toBeLessThan(2.2);
    meshes.forEach(mesh => mesh.geometry.dispose());
    disposeMaterials();
  });
  it("keeps the mobile GPU geometry below 70% of the full model without changing bounds", () => {
    const drawing = { fillRect() {}, beginPath() {}, ellipse() {}, stroke() {}, createRadialGradient: () => ({ addColorStop() {} }) };
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(drawing as unknown as CanvasRenderingContext2D);
    const full = buildSystemsCore();
    const compact = buildSystemsCore({ compact: true });
    const bytes = (core: THREE.Group) => core.children.reduce((sum, object) => {
      if (!(object instanceof THREE.Mesh)) return sum;
      return sum + Object.values(object.geometry.attributes).reduce((total, attribute) => total + attribute.array.byteLength, 0);
    }, 0);
    expect(bytes(compact.core)).toBeLessThan(bytes(full.core) * .7);
    const fullBounds = new THREE.Box3().setFromObject(full.core).getSize(new THREE.Vector3());
    const compactBounds = new THREE.Box3().setFromObject(compact.core).getSize(new THREE.Vector3());
    expect(compactBounds.distanceTo(fullBounds)).toBeLessThan(.01);
    for (const model of [full, compact]) {
      model.core.children.forEach(object => { if (object instanceof THREE.Mesh) object.geometry.dispose(); });
      model.disposeMaterials();
    }
  });
});
