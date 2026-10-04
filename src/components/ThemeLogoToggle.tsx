"use client";

import Image from "next/image";

type Props = {
  theme: "dark" | "light";
  onToggle: () => void;
  className?: string;
};

/** The navbar shows the current identity; the accessible label describes the action. */
export function ThemeLogoToggle({ theme, onToggle, className = "" }: Props) {
  const label = theme === "dark" ? "Switch to silver suit theme" : "Switch to RCB theme";
  return (
    <button type="button" className={`theme-logo-toggle ${className}`} onClick={onToggle} aria-label={label} title={label}>
      <Image src={theme === "dark" ? "/logos/theme/rcb-mark.png" : "/logos/theme/mib-mark.png"} alt="" aria-hidden="true" width={48} height={48} unoptimized className={theme === "light" ? "suit-logo" : undefined} />
    </button>
  );
}
