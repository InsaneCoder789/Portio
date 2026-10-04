const phrases = [
  "Software Developer", "backend systems", "scalable mobile applications",
  "technical leadership", "cross-functional collaboration", "software architecture",
  "scalable systems", "UI/UX engineering", "real-world product development",
  "system design", "distributed systems", "reliability", "maintainability",
  "reliable in production", "intentional in UX", "product thinking",
  "offline-first", "retry-safe", "privacy-conscious", "reusable", "trust",
];
const secondary = new Set(["technical leadership", "UI/UX engineering", "intentional in UX", "product thinking", "trust"]);
const expression = new RegExp(`\\b(${phrases.map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`, "gi");
const vocabulary = new Set(phrases.map((phrase) => phrase.toLowerCase()));

/** Preserve every character and ordinary inline wrapping; never inject HTML. */
export function emphasisParts(text: string, selectedPhrases?: readonly string[]) {
  const selected = selectedPhrases ? new Set(selectedPhrases.map(phrase => phrase.toLowerCase())) : vocabulary;
  return text.split(expression).filter(Boolean).map((text) => ({
    text,
    tone: selected.has(text.toLowerCase()) ? (secondary.has(text.toLowerCase()) ? "secondary" : "primary") : undefined,
  }));
}
