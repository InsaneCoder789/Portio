import { motion } from "framer-motion";
import { ExternalLink, GitBranch, Star } from "lucide-react";

interface ProjectCardProps {
  name: string;
  description: string;
  tech: string[];
  stars?: number;
  url?: string;
  delay?: number;
}

const ProjectCard = ({ name, description, tech, stars, url, delay = 0 }: ProjectCardProps) => {
  return (
    <motion.a
      href={url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group block relative p-10 rounded-[40px] cyber-glass hover:border-primary/30 transition-all overflow-hidden h-full flex flex-col"
    >
      <div className="relative z-10 flex flex-col h-full gap-8">
        <div className="flex items-start justify-between">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <GitBranch className="w-7 h-7" />
          </div>
          <div className="flex items-center gap-4">
            {stars !== undefined && (
              <div className="flex items-center gap-1.5 text-primary text-[10px] font-black uppercase tracking-widest">
                <Star className="w-4 h-4 fill-primary" /> {stars}
              </div>
            )}
            <ExternalLink className="w-5 h-5 text-white/20 group-hover:text-primary transition-colors" />
          </div>
        </div>

        <div className="space-y-3 flex-1">
          <h3 className="text-2xl sm:text-3xl font-black tracking-tighter text-white uppercase font-outfit group-hover:text-primary transition-colors">{name}</h3>
          <p className="text-sm sm:text-base text-white/40 leading-relaxed font-medium line-clamp-3">{description}</p>
        </div>

        <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5">
          {tech.map((t) => (
            <span key={t} className="px-3.5 py-1.5 rounded-lg bg-black/40 text-[9px] font-black uppercase tracking-widest text-white/30 border border-white/5 group-hover:border-primary/10 transition-colors">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Decorative Background Element */}
      <div className="absolute -bottom-8 -right-8 opacity-0 group-hover:opacity-[0.03] transition-all duration-700 pointer-events-none">
        <GitBranch className="w-64 h-64 text-primary" />
      </div>
    </motion.a>
  );
};

export default ProjectCard;
