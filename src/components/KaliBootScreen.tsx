import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  { text: "[    0.000000] WARP-OS v4.5.0-production (rohan@warpspace.io)", delay: 0 },
  { text: "[    0.000000] Initializing specialist environment...", delay: 50 },
  { text: "[    0.004123] BIOS-provided physical RAM map:", delay: 100 },
  { text: "[    0.004125]  BIOS-e820: [mem 0x0000000000000000-0x000000000009ffff] usable", delay: 130 },
  { text: "[    0.004128]  BIOS-e820: [mem 0x0000000000100000-0x0000000fffffffff] usable", delay: 160 },
  { text: "[    0.123456] Detecting Core: Intel i9-14900KS (24 Cores) @ 6.2GHz", delay: 250 },
  { text: "[    0.184510] CPU0: Thermal monitoring enabled (24 P-Cores / E-Cores)", delay: 320 },
  { text: "[    0.234567] Memory: 65536MB DDR5 (SYNCHRONIZED) clocking @ 7200MHz", delay: 400 },
  { text: "[    0.310245] ACPI: Core revision 20240101", delay: 480 },
  { text: "[    0.415892] Fading into protected mode... Success.", delay: 550 },
  { text: "[    0.489210] SCSI subsystem initialized", delay: 620 },
  { text: "[    0.567890] Neural Link: ESTABLISHED (Uplink 10Gbps, Latency <1ms)", delay: 700 },
  { text: "[    0.641255] iommu: Defaulting to passthrough mode", delay: 780 },
  { text: "[    0.710482] USB Mass Storage support registered.", delay: 850 },
  { text: "[    0.789012] Security: LAKSHMAN_REKHA_GUARD v2.0 (ACTIVE)", delay: 920 },
  { text: "[    0.854120] Encryption: AES-256-GCM hardware acceleration enabled", delay: 1000 },
  { text: "[    0.920145] Sandboxing profile: PARANOID_STRICT_v4 loading...", delay: 1080 },
  { text: "[    1.012345] OS: WARP_ARCHITECTURE_GEN_4 (STABLE)", delay: 1150 },
  { text: "[  OK  ] Mounting root filesystem (/dev/nvme0n1p2)...", delay: 1250, ok: true },
  { text: "[  OK  ] Optimizing storage clusters and file trees...", delay: 1350, ok: true },
  { text: "[  OK  ] Initializing Design Systems...", delay: 1450, ok: true },
  { text: "[  OK  ] Loading Tailwind CSS compiler modules...", delay: 1550, ok: true },
  { text: "[  OK  ] Component library Framer-Motion linked.", delay: 1650, ok: true },
  { text: "[  OK  ] Loading Experience Data...", delay: 1750, ok: true },
  { text: "[    1.820145]   -> Pulling projects.json (Remote DB)... Connected.", delay: 1820 },
  { text: "[    1.901245]   -> Hydrating tech-stack schemas...", delay: 1900 },
  { text: "[  OK  ] Finalizing System Synchronization...", delay: 2050, ok: true },
  { text: "[  OK  ] Starting NextJS API Route Handlers...", delay: 2150, ok: true },
  { text: "[  OK  ] Firewall rules synchronized via iptables.", delay: 2250, ok: true },
  { text: "", delay: 2350 },
  { text: "  ██╗  ██╗ █████╗ ██╗     ██╗", delay: 2450, ascii: true },
  { text: "  ██║ ██╔╝██╔══██╗██║     ██║", delay: 2500, ascii: true },
  { text: "  █████╔╝ ███████║██║     ██║", delay: 2550, ascii: true },
  { text: "  ██╔═██╗ ██╔══██║██║     ██║", delay: 2600, ascii: true },
  { text: "  ██║  ██╗██║  ██║███████╗██║", delay: 2650, ascii: true },
  { text: "  ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝", delay: 2700, ascii: true },
  { text: "", delay: 2750 },
  { text: "  rochiee@warp-terminal:~$ ./deploy_portfolio.sh --env=production", delay: 2950, cmd: true },
  { text: "  [*] Spawning background daemon process...", delay: 3150 },
  { text: "  [*] Verifying SSL certificates for warpspace.io...", delay: 3350 },
  { text: "  [+] SSL Status: VALID (Expires in 365 days)", delay: 3500, success: true },
  { text: "  [*] Running static site optimization pass...", delay: 3700 },
  { text: "  [*] System check: COMPLETE", delay: 3900 },
  { text: "  [+] Node operational. Welcome, Architect.", delay: 4100, success: true },
];

const BOOT_TIMING_MULTIPLIER = 1.0;
const BOOT_DONE_DELAY = 4500;
const BOOT_EXIT_DELAY = 5200;

const KaliBootScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    BOOT_LINES.forEach((line, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), Math.round(line.delay * BOOT_TIMING_MULTIPLIER)));
    });
    timers.push(setTimeout(() => setDone(true), BOOT_DONE_DELAY));
    timers.push(setTimeout(() => onComplete(), BOOT_EXIT_DELAY));
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done ? (
        <motion.div
          className="fixed inset-0 z-50 bg-[#020617] flex items-start justify-start p-6 md:p-12 overflow-y-auto"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 z-[-1] overflow-hidden opacity-40">
            <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-full h-[60%] bg-primary/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[100px] rounded-full" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>

          <div className="relative font-mono text-[10px] md:text-xs leading-relaxed max-w-4xl pb-12 w-full">
            {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
              <div key={i} className="whitespace-pre-wrap break-all md:whitespace-pre">
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
