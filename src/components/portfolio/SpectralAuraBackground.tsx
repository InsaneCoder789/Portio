type SpectralAuraBackgroundProps = {
  active?: boolean;
};

export function SpectralAuraBackground({ active = true }: SpectralAuraBackgroundProps) {
  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="spectral-base" />
      <div className="spectral-aura spectral-aura-one" />
      <div className="spectral-aura spectral-aura-two" />
      <div className="spectral-vignette" />
    </div>
  );
}
