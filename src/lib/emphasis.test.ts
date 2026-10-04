import { describe, expect, it } from "vitest";
import { emphasisParts } from "./emphasis";

describe("portfolio text emphasis", () => {
  it("preserves punctuation, casing and whitespace exactly", () => {
    const source = "Software Developer with backend systems, UI/UX engineering, and reliability.  Product thinking matters.";
    expect(emphasisParts(source).map((part) => part.text).join("")).toBe(source);
    expect(emphasisParts(source).filter((part) => part.tone)).toHaveLength(5);
  });
  it("does not color substrings inside unrelated words", () => {
    expect(emphasisParts("trustworthy architecture").every((part) => !part.tone)).toBe(true);
  });
  it("limits About emphasis without changing the global vocabulary", () => {
    const source = "Software Developer building backend systems with UI/UX engineering.";
    const parts = emphasisParts(source, ["Software Developer"]);
    expect(parts.map(part => part.text).join("")).toBe(source);
    expect(parts.filter(part => part.tone).map(part => part.text)).toEqual(["Software Developer"]);
    expect(emphasisParts(source).filter(part => part.tone)).toHaveLength(3);
  });
});
