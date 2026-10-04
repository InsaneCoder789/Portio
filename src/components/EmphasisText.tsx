import { emphasisParts } from "@/lib/emphasis";

export function EmphasisText({ children, phrases }: { children: string; phrases?: readonly string[] }) {
  return emphasisParts(children, phrases).map((part, index) => part.tone
    ? <strong key={index} className={`text-emphasis text-emphasis-${part.tone}`}>{part.text}</strong>
    : part.text);
}
