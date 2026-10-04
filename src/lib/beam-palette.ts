export function beamPalette(theme: "dark" | "light") {
  return theme === "dark"
    ? { core: "#D1AB3E", glow: "#EC1C24", corona: "#D1AB3E", charge: "#EC1C24", flash: "#ffe7a0" }
    : { core: "#dce1e9", glow: "#61adff", corona: "#9dceff", charge: "#61adff", flash: "#e0efff" };
}
