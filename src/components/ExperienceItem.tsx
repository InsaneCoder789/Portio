import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Briefcase, ChevronRight } from "lucide-react";
import { ExperienceItem as ExpItem } from "@/data/linkedin";

interface Props {
  item: ExpItem;
  delay?: number;
}

const ExperienceItem = ({ item, delay = 0 }: Props) => {
  const [failed, setFailed] = useState(false);
  const isCompactLogo =
    item.company === "GFG KIIT" ||
    item.company === "National Service Scheme (NSS SCE KIIT)";
  const isDonumLogo = item.company === "Donum";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group relative flex flex-col md:flex-row items-start gap-8 p-8 sm:p-10 rounded-[32px] sm:rounded-[40px] cyber-glass hover:bg-white/[0.04] transition-all hover:border-primary/20"
    >
      <div className="relative group shrink-0">
        <div className="absolute -inset-2 bg-primary/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <div
          className={`relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/10 group-hover:border-primary/30 transition-all overflow-hidden shadow-2xl backdrop-blur-sm ${
            isCompactLogo ? "bg-white p-0.5" : isDonumLogo ? "bg-black p-1.5" : "bg-black p-2"
          }`}
        >
          {failed || !item.logo ? (
            <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 text-white/10" />
          ) : (
            <img
              src={item.logo}
              alt={item.company}
              className={`w-full h-full transition-transform group-hover:scale-110 ${
                isCompactLogo ? "object-cover scale-110" : isDonumLogo ? "object-cover scale-[1.05]" : "object-contain"
              }`}
              onError={() => setFailed(true)}
              referrerPolicy="no-referrer"
            />
          )}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
        </div>
      </div>

      <div className="flex-1 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-outfit group-hover:text-primary transition-colors">
              {item.role}
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-primary font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em]">{item.company}</span>
              <span className="text-white/20 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">• {item.type}</span>
            </div>
          </div>
          <div className="px-5 py-2 rounded-full bg-white/5 border border-white/5 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-primary group-hover:border-primary/20 transition-all sm:self-start">
            {item.duration}
          </div>
        </div>

        <div className="flex flex-wrap gap-6 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            {item.location}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500/40" />
            {item.mode}
          </div>
        </div>

        {item.points && item.points.length > 0 ? (
          <ul className="space-y-2 text-white/50 text-xs sm:text-sm leading-relaxed max-w-3xl">
            {item.points.map((point, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="text-primary mt-1.5 shrink-0 w-1 h-1 rounded-full bg-primary" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        ) : item.description && (
          <p className="text-white/50 text-xs sm:text-sm leading-relaxed max-w-3xl">
            {item.description}
          </p>
        )}

        {item.skills && item.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 sm:gap-3 pt-5 border-t border-white/5">
            {item.skills.map((skill) => (
              <span key={skill} className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-black text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white/20 border border-white/5 hover:border-primary/20 hover:text-primary transition-all cursor-default">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="absolute top-1/2 -translate-y-1/2 right-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all hidden md:block">
        <ChevronRight className="w-8 h-8 text-primary/40" />
      </div>
    </motion.div>
  );
};

export default ExperienceItem;
