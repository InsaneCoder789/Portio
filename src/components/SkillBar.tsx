import { motion } from "framer-motion";

interface SkillBarProps {
  name: string;
  level: number;
  delay?: number;
}

const SkillBar = ({ name, level, delay = 0 }: SkillBarProps) => {
  return (
    <div className="space-y-4 group">
      <div className="flex justify-between items-end px-2">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 group-hover:text-primary transition-colors">
          {name}
        </span>
        <span className="text-[10px] font-black tabular-nums text-white/20 group-hover:text-primary transition-colors tracking-widest">
          {level}%
        </span>
      </div>
      <div className="h-4 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/5 group-hover:border-primary/20 transition-all p-1">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-primary/40 to-primary rounded-full relative group-hover:shadow-[0_0_15px_rgba(255,44,125,0.3)] transition-all"
        />
      </div>
    </div>
  );
};

export default SkillBar;
