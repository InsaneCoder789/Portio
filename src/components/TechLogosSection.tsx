import { motion } from "framer-motion";
import { publicAsset } from "@/lib/utils";

const TECH_ITEMS = [
  { label: "React", logo: publicAsset("logos/react.svg") },
  { label: "TypeScript", logo: publicAsset("logos/typescript.svg") },
  { label: "Kotlin", logo: publicAsset("logos/kotlin.svg") },
  { label: "MySQL", logo: publicAsset("logos/mysql.svg") },
  { label: "PostgreSQL", logo: publicAsset("logos/postgresql.svg") },
  { label: "Firebase", logo: publicAsset("logos/firebase.svg") },
  { label: "Python", logo: publicAsset("logos/python.svg") },
  { label: "Linux", logo: publicAsset("logos/linux.svg") },
  { label: "Git", logo: publicAsset("logos/git.svg") },
  { label: "JavaScript", logo: publicAsset("logos/javascript.svg") },
  { label: "HTML", logo: publicAsset("logos/html.svg") },
  { label: "CSS", logo: publicAsset("logos/css.svg") },
];

const TechLogosSection = ({ delay = 1.4 }: { delay?: number }) => {
  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 whitespace-nowrap">Core Technology Stack</h3>
        <div className="h-px flex-1 bg-white/5" />
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-8">
        {TECH_ITEMS.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: delay + i * 0.05 }}
            className="group flex flex-col items-center gap-4"
          >
            <div className="aspect-square w-full rounded-3xl cyber-glass flex items-center justify-center p-5 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-primary/10">
              <img
                src={item.logo}
                alt={item.label}
                className="w-full h-full object-contain transition-all duration-500 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${item.label.toLowerCase()}/${item.label.toLowerCase()}-original.svg`;
                }}
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] group-hover:text-primary transition-colors">
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TechLogosSection;
