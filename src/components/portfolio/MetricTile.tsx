import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

type MetricTileProps = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  valueNode?: ReactNode;
};

export function MetricTile({ label, value, icon: Icon, valueNode }: MetricTileProps) {
  return (
    <Card className="portfolio-card border-white/10 bg-white/[0.035] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="space-y-2">
          <p className="metric-tile-label text-[0.65rem] uppercase tracking-[0.32em] text-slate-500">{label}</p>
          <p className="metric-tile-value font-['Outfit'] text-3xl font-semibold tracking-[-0.05em] text-white">
            {valueNode ?? value}
          </p>
        </div>
        <span className="metric-tile-icon rounded-2xl border border-white/10 bg-sky-400/10 p-2 text-sky-200">
          <Icon className="h-4 w-4" />
        </span>
      </CardContent>
    </Card>
  );
}
