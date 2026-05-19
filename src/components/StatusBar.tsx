import { useEffect, useState } from "react";
import { Wifi, Shield, Cpu, Activity, Skull, Lock } from "lucide-react";

const StatusBar = () => {
  const [time, setTime] = useState(new Date());
  const [packets, setPackets] = useState(0);
  const [mem, setMem] = useState(23);

  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date());
      setPackets((p) => p + Math.floor(Math.random() * 50 + 10));
      setMem(Math.floor(Math.random() * 15 + 18));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex items-center justify-between px-4 sm:px-10 py-3 text-[10px] text-white/30 font-mono tracking-[0.2em] w-full">
      <div className="flex items-center gap-4 sm:gap-10">
        <span className="flex items-center gap-2 text-terminal-prompt font-black tracking-[0.3em] terminal-glow">
           WARPFOLIO_V4.6
        </span>
        <div className="h-4 w-px bg-white/10 hidden sm:block" />
        <span className="flex items-center gap-2 font-bold uppercase transition-colors hover:text-terminal-prompt">
          <Shield className="w-3.5 h-3.5 opacity-40 text-terminal-cyan" /> <span className="opacity-60 text-terminal-cyan font-black">NODE_SECURE</span>
        </span>
        <span className="hidden lg:flex items-center gap-2 px-6 border-x border-white/5">
          <Activity className="w-3.5 h-3.5 opacity-40 text-terminal-success" /> 
          <span className="text-terminal-success opacity-80 tabular-nums font-black text-[9px]">UPLINK: {packets.toLocaleString()}</span>
        </span>
      </div>
      <div className="flex items-center gap-4 sm:gap-10">
        <span className="flex items-center gap-2 hidden md:flex font-bold">
          <Cpu className="w-3.5 h-3.5 opacity-40" /> <span className="opacity-40">MEMORY:</span> <span className="text-white opacity-80 tabular-nums">{mem}%</span>
        </span>
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-terminal-prompt animate-pulse shadow-[0_0_10px_rgba(255,44,125,0.6)]" />
           <span className="text-terminal-prompt font-black tracking-widest uppercase">
             LIVE_UPLINK
           </span>
        </div>
        <span className="text-white font-black tabular-nums bg-white/10 px-4 py-1 rounded-md border border-white/10">
          {time.toLocaleTimeString("en-US", { hour12: false })}
        </span>
      </div>
    </div>
  );
};

export default StatusBar;
