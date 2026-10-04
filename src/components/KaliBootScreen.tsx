"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { preloadBootAssets, type BootProgress } from "../lib/boot-preload";

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
const KaliBootScreen = ({ onComplete, scenesReady = true, onAssetsReady }: { onComplete: () => void; scenesReady?: boolean; onAssetsReady?: () => void }) => {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [done, setDone] = useState(false);
  const [logReady, setLogReady] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [slow, setSlow] = useState(false);
  const [preload, setPreload] = useState<BootProgress>({ completed: 0, total: 1, failed: 0, finished: false });

  useEffect(() => {
    const controller = new AbortController();
    setPreload({ completed: 0, total: 1, failed: 0, finished: false });
    setSlow(false);
    const slowTimer = setTimeout(() => setSlow(true), 12000);
    void preloadBootAssets(controller.signal, setPreload);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const background = [...document.querySelectorAll<HTMLElement>(".nav-shell,.mobile-nav-control,.page-stack,.footer,.skip-to-content")];
    const inertStates = background.map(element => element.inert);
    background.forEach(element => { element.inert = true; });
    return () => { clearTimeout(slowTimer); controller.abort(); document.body.style.overflow = previous; background.forEach((element, index) => { element.inert = inertStates[index]; }); };
  }, [attempt]);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    BOOT_LINES.forEach((line, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), Math.round(line.delay * BOOT_TIMING_MULTIPLIER)));
    });
    timers.push(setTimeout(() => setLogReady(true), BOOT_DONE_DELAY));
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (preload.finished && !preload.failed) onAssetsReady?.();
  }, [preload.finished, preload.failed, onAssetsReady]);

  useEffect(() => {
    if (!logReady || !preload.finished || preload.failed || !scenesReady) return;
    setDone(true);
    const timer = setTimeout(onComplete, 500);
    return () => clearTimeout(timer);
  }, [logReady, preload.finished, preload.failed, scenesReady, onComplete]);

  return (
    <AnimatePresence>
      {!done ? (
        <motion.div
          className="fixed inset-0 z-50 bg-[#020617] flex items-start justify-start p-6 md:p-12 overflow-y-auto"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          role="dialog"
          aria-modal="true"
          aria-label="Preparing portfolio"
        >
          <div className="absolute inset-0 z-[-1] overflow-hidden opacity-40">
            <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-full h-[60%] bg-primary/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[100px] rounded-full" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>

          <div className="relative font-mono text-[10px] md:text-xs leading-relaxed max-w-4xl pb-40 w-full">
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
          <div className="boot-readiness" aria-live="polite">
            <span>Preparing visuals · {preload.completed}/{preload.total}{preload.finished && !preload.failed && !scenesReady ? " · GPU shader warm-up" : ""}</span>
            <progress aria-label="Portfolio assets loaded" value={preload.completed} max={preload.total} />
            {((preload.finished && preload.failed > 0) || slow) && <>
              <p>{preload.failed > 0 ? `${preload.failed} visual resource(s) could not load.` : "Preparing visuals is taking longer than expected."} Retry when connected, or continue with available visuals.</p>
              <button type="button" onClick={() => setAttempt(value => value + 1)}>Retry loading</button>
              <button type="button" onClick={onComplete}>Continue with available visuals</button>
            </>}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default KaliBootScreen;
