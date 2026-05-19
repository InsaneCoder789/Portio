import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  { text: "[    0.000000] WARP-OS v4.5.0-production (rohan@warpspace.io)", delay: 0 },
  { text: "[    0.000000] Initializing specialist environment...", delay: 100 },
  { text: "[    0.123456] Detecting Core: Intel i9-14900KS (24 Cores) @ 6.2GHz", delay: 200 },
  { text: "[    0.234567] Memory: 65536MB DDR5 (SYNCHRONIZED)", delay: 350 },
  { text: "[    0.567890] Neural Link: ESTABLISHED (Uplink 10Gbps)", delay: 500 },
  { text: "[    0.789012] Security: LAKSHMAN_REKHA_GUARD v2.0 (ACTIVE)", delay: 650 },
  { text: "[    1.012345] OS: WARP_ARCHITECTURE_GEN_4 (STABLE)", delay: 800 },
  { text: "[  OK  ] Mounting Architecture Modules...", delay: 1000, ok: true },
  { text: "[  OK  ] Initializing Design Systems...", delay: 1150, ok: true },
  { text: "[  OK  ] Loading Experience Data...", delay: 1300, ok: true },
  { text: "[  OK  ] Finalizing System Synchronization...", delay: 1450, ok: true },
  { text: "", delay: 1600 },
  { text: "  ██╗  ██╗ █████╗ ██╗     ██╗", delay: 1700, ascii: true },
  { text: "  ██║ ██╔╝██╔══██╗██║     ██║", delay: 1750, ascii: true },
  { text: "  █████╔╝ ███████║██║     ██║", delay: 1800, ascii: true },
  { text: "  ██╔═██╗ ██╔══██║██║     ██║", delay: 1850, ascii: true },
  { text: "  ██║  ██╗██║  ██║███████╗██║", delay: 1900, ascii: true },
  { text: "  ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝", delay: 1950, ascii: true },
  { text: "", delay: 2000 },
  { text: "  rochiee@warp-terminal:~$ ./deploy_portfolio.sh", delay: 2200, cmd: true },
  { text: "  [*] System check: COMPLETE", delay: 2400 },
  { text: "  [+] Node operational. Welcome, Architect.", delay: 2600, success: true },
];

const KaliBootScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    BOOT_LINES.forEach((line, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), line.delay));
    });
    timers.push(setTimeout(() => setDone(true), 3400));
    timers.push(setTimeout(() => onComplete(), 4000));
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done ? (
        <motion.div
          className="fixed inset-0 z-50 bg-[#020617] flex items-start justify-start p-6 md:p-12 overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Ambient Background Glows */}
          <div className="absolute inset-0 z-[-1] overflow-hidden opacity-40">
            <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-full h-[60%] bg-primary/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[100px] rounded-full" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>

          <div className="relative font-mono text-[10px] md:text-xs leading-relaxed max-w-4xl">
            {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
              <div key={i} className="whitespace-pre">
                {line.ok ? (
                  <span>
                    <span className="text-terminal-success">[  OK  ]</span>
                    <span className="text-foreground">{line.text.replace("[  OK  ]", "")}</span>
                  </span>
                ) : line.ascii ? (
                  <span className="text-primary terminal-glow">{line.text}</span>
                ) : line.cmd ? (
                  <span className="text-terminal-success">{line.text}</span>
                ) : line.success ? (
                  <span className="text-terminal-success font-bold">{line.text}</span>
                ) : (
                  <span className="text-muted-foreground">{line.text}</span>
                )}
              </div>
            ))}
            <span className="animate-blink text-terminal-success">█</span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default KaliBootScreen;
