"use client";

import { useEffect, useRef, useState } from "react";

type CountUpValueProps = {
  value: number;
  active: boolean;
  duration?: number;
};

export function CountUpValue({ value, active, duration = 1100 }: CountUpValueProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      setDisplayValue(0);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayValue(value);
      return;
    }

    const startValue = 0;
    const delta = value;
    setDisplayValue(0);
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(startValue + delta * eased));

      if (progress < 1) frameRef.current = window.requestAnimationFrame(tick);
    };

    frameRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, [active, duration, value]);

  return <>{displayValue.toLocaleString()}</>;
}
