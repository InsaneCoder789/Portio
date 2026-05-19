import { Shield, Skull } from "lucide-react";

const TerminalTitleBar = () => {
  return (
    <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 bg-terminal-block/95 border-b border-white/5 backdrop-blur-md">
      <div className="flex items-center gap-2 sm:gap-2.5">
        <div className="w-3 h-3 rounded-full bg-terminal-error/40 border border-terminal-error shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
        <div className="w-3 h-3 rounded-full bg-terminal-warning/40 border border-terminal-warning shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
        <div className="w-3 h-3 rounded-full bg-terminal-success/40 border border-terminal-success shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
      </div>
      <div className="flex-1 flex justify-center">
        <span className="text-muted-foreground text-[10px] sm:text-xs tracking-[0.2em] uppercase font-black flex items-center gap-1.5 sm:gap-3">
          <Skull className="w-4 h-4 text-terminal-cyan animate-pulse" />
          <span className="cyber-gradient-text">user@warpfolio</span>
          <span className="text-white/20 hidden sm:inline">|</span>
          <span className="text-terminal-prompt hidden sm:inline opacity-70">~/systems/core</span>
          <Shield className="w-3.5 h-3.5 text-terminal-cyan/60 ml-1 sm:ml-2" />
        </span>
      </div>
      <div className="hidden sm:flex items-center gap-4 text-[10px] font-bold text-white/30">
        <span>80x24</span>
        <span>UTF-8</span>
      </div>
    </div>
  );
};

export default TerminalTitleBar;
