import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Terminal } from "lucide-react";

interface CommandInputProps {
  onCommand: (cmd: string) => void;
}

const COMMANDS: Record<string, string> = {
  help: "AVAILABLE_PROTOCOLS: about, projects, skills, contact, clear, whoami, uname, help",
  about: "INITIALIZING_REDIRECTION_TO: [ABOUT_NODE]...",
  projects: "INITIALIZING_REDIRECTION_TO: [PROJECT_NODE]...",
  skills: "INITIALIZING_REDIRECTION_TO: [SKILL_NODE]...",
  contact: "INITIALIZING_REDIRECTION_TO: [CONTACT_NODE]...",
  whoami: "IDENT: ROHAN_CHATTERJEE_ROOT",
  uname: "WARP_OS 4.5.0-x86_64 #1 SMP HYPER_STABLE",
  clear: "",
};

const CommandInput = ({ onCommand }: CommandInputProps) => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<{ cmd: string; output: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      const cmd = input.trim().toLowerCase().slice(0, 50);
      // Only allow known commands — prevent injection
      const safeCmd = cmd.replace(/[^a-z0-9\-_ ]/g, "");
      if (safeCmd === "clear") {
        setHistory([]);
      } else {
        const output = COMMANDS[safeCmd] || `bash: ${safeCmd}: command not found. Type 'help' for available commands.`;
        setHistory((h) => [...h.slice(-20), { cmd: safeCmd, output }]);
      }
      onCommand(safeCmd);
      setInput("");
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col justify-end max-h-48 overflow-y-auto cursor-text scrollbar-hide px-4"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="space-y-4">
        {history.map((h, i) => (
          <div key={i} className="animate-fade-in-up last:mb-0">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
              <span className="text-terminal-success">λ</span>
              <span className="text-white/60">{h.cmd}</span>
            </div>
            {h.output && <div className="text-terminal-output text-[10px] pl-6 mb-2 border-l border-white/5 font-bold uppercase tracking-widest opacity-40">{h.output}</div>}
          </div>
        ))}
        
        {/* Active prompt */}
        <div className="relative group pb-2">
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em]">
            <span className="text-terminal-prompt shadow-[0_0_10px_rgba(0,242,255,0.2)] animate-pulse">λ</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-white caret-terminal-prompt text-[10px] placeholder:text-white/5 tracking-[0.3em] font-black uppercase"
              spellCheck={false}
              autoComplete="off"
              placeholder="INIT_CMD_SEQUENCE..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandInput;
