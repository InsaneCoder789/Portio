import { describe, expect, it } from "vitest";
import { beamPalette } from "./beam-palette";

describe("theme-aware Death Star palette", () => {
  it("uses the exact RCB red and gold for its beam layers", () => {
    const colors = beamPalette("dark");
    expect(colors.core).toBe("#D1AB3E");
    expect(colors.glow).toBe("#EC1C24");
    expect(colors.charge).toBe("#EC1C24");
  });

  it("uses blue accents around a silver beam core in the suit theme", () => {
    const colors = beamPalette("light");
    expect(colors.glow).toBe("#61adff");
    expect(colors.charge).toBe("#61adff");
    expect(colors.corona).toBe("#9dceff");
    expect(colors.core).toBe("#dce1e9");
  });
});
