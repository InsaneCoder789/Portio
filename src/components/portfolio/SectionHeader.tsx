type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="section-header max-w-3xl space-y-4">
      <p className="section-header-eyebrow text-[0.68rem] uppercase tracking-[0.4em] text-sky-200/55">
        {eyebrow}
      </p>
      <div className="space-y-4">
        <h2 className="section-header-title font-['Outfit'] text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">
          {title}
        </h2>
        <p className="section-header-description max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
          {description}
        </p>
      </div>
    </div>
  );
}
