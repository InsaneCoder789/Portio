import { motion } from "framer-motion";

const GITHUB_USERNAME = "InsaneCoder789";

const GithubContributions = ({ delay = 0 }: { delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="w-full overflow-hidden"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
          ▸ GITHUB_ACTIVITY_METRICS:
        </span>
        <div className="h-px flex-1 bg-white/5" />
      </div>
      <div className="p-4 rounded-xl cyber-glass">
        <img
          src={`https://ghchart.rshah.org/218bff/${GITHUB_USERNAME}`}
          alt={`${GITHUB_USERNAME}'s GitHub contribution graph`}
          className="w-full opacity-80 hover:opacity-100 transition-opacity filter drop-shadow-[0_0_8px_rgba(33,139,255,0.2)]"
          referrerPolicy="no-referrer"
        />
        <div className="flex items-center justify-between mt-4 text-[10px] font-black uppercase tracking-widest text-white/30">
          <span>Contributions in the last year</span>
          <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded border border-white/5">
            <span>Less</span>
            <div className="w-2.5 h-2.5 rounded-sm border border-white/5 bg-[#161b22]" />
            <div className="w-2.5 h-2.5 rounded-sm bg-[#002d5e]" />
            <div className="w-2.5 h-2.5 rounded-sm bg-[#004d80]" />
            <div className="w-2.5 h-2.5 rounded-sm bg-[#007acc]" />
            <div className="w-2.5 h-2.5 rounded-sm bg-[#218bff] shadow-[0_0_5px_#218bff]" />
            <span>More</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GithubContributions;
