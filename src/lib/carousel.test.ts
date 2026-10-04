import { describe, expect, it } from "vitest";
import { carouselOffset } from "./carousel";

describe("looping project deck", () => {
  it("keeps the selected card centered and wraps its neighbors", () => {
    expect(carouselOffset(0, 0, 9)).toBe(0);
    expect(carouselOffset(8, 0, 9)).toBe(-1);
    expect(carouselOffset(0, 8, 9)).toBe(1);
    expect(carouselOffset(7, 0, 9)).toBe(-2);
  });
  it("has exactly five visible positions at every selection", () => {
    for (let active = 0; active < 9; active++) {
      const visible = Array.from({ length: 9 }, (_, index) => carouselOffset(index, active, 9)).filter(x => Math.abs(x) <= 2);
      expect(visible.sort((a, b) => a - b)).toEqual([-2, -1, 0, 1, 2]);
    }
  });
});
