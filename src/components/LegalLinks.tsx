import Link from "next/link";

// The small print every page ends with.
export default function LegalLinks() {
  return (
    <nav className="legal" aria-label="Legal and site information">
      <Link href="/privacy">Privacy</Link>
      <Link href="/terms">Terms</Link>
      <Link href="/accessibility">Accessibility</Link>
      <Link href="/#contact">Contact</Link>
    </nav>
  );
}
