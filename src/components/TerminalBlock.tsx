import { motion } from "framer-motion";
import { ReactNode } from "react";

interface TerminalBlockProps {
  command: string;
  prompt?: string;
  children: ReactNode;
  delay?: number;
}

const TerminalBlock = ({ command, prompt = "~", children, delay = 0 }: TerminalBlockProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      className="group relative rounded-2xl bg-[#05060a] border border-white/5 hover:border-terminal-prompt/30 transition-all duration-500 mb-10 overflow-hidden shadow-2xl shadow-black/50"
    >
      {/* subtle accent stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-terminal-prompt/20 group-hover:bg-terminal-prompt/60 transition-all" />
      
      {/* Command header */}
      <div className="px-6 sm:px-10 pt-6 sm:pt-8 pb-4 relative z-10">
        <div className="flex items-center justify-between mb-4">
           <div className="flex items-center gap-2 opacity-20">
              <div className="w-2 h-2 rounded-full bg-white/20" />
              <div className="w-2 h-2 rounded-full bg-white/20" />
              <div className="w-2 h-2 rounded-full bg-white/20" />
           </div>
           <div className="text-[10px] font-black text-white/10 uppercase tracking-[0.4em]">{prompt}</div>
        </div>
        <div className="flex items-center gap-3 text-sm sm:text-base font-bold">
          <span className="text-terminal-prompt select-none opacity-80">λ</span>
          <span className="text-white break-all tracking-tight opacity-90">{command}</span>
          <motion.div 
            animate={{ opacity: [1, 0, 1] }} 
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="w-2 h-5 bg-terminal-prompt/50 ml-1 inline-block"
          />
        </div>
      </div>
      
      <div className="mx-10 h-px bg-white/5" />
      
      {/* Output */}
      <div className="px-6 sm:px-10 pb-8 pt-6 leading-relaxed text-terminal-output relative z-10 transition-colors group-hover:text-white/80">
        {children}
      </div>
    </motion.div>
  );
};

export default TerminalBlock;
