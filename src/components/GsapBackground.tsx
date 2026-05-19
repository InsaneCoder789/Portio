import { useEffect, useRef } from "react";
import gsap from "gsap";

const GsapBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const container = containerRef.current!;
      const numParticles = 80;

      // Create floating stardust particles
      for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement("div");
        const size = Math.random() * 2 + 0.5;
        particle.className = "absolute rounded-full bg-primary/20 pointer-events-none";
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        container.appendChild(particle);

        gsap.to(particle, {
          x: "random(-150, 150)",
          y: "random(-150, 150)",
          opacity: "random(0.05, 0.4)",
          duration: "random(20, 40)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Create cinematic deep sky nebulas
      const numNebulas = 4;
      for (let i = 0; i < numNebulas; i++) {
        const nebula = document.createElement("div");
        const size = Math.random() * 1000 + 600;
        nebula.className = "absolute rounded-full blur-[150px] pointer-events-none opacity-[0.08]";
        nebula.style.width = `${size}px`;
        nebula.style.height = `${size}px`;
        nebula.style.background = i % 2 === 0 
          ? "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)"
          : "radial-gradient(circle, hsl(199, 100%, 50%) 0%, transparent 70%)";
        nebula.style.left = `${Math.random() * 100}%`;
        nebula.style.top = `${Math.random() * 100}%`;
        nebula.style.transform = "translate(-50%, -50%)";
        container.appendChild(nebula);

        gsap.to(nebula, {
          x: "random(-300, 300)",
          y: "random(-300, 300)",
          scale: "random(0.7, 1.5)",
          opacity: "random(0.03, 0.08)",
          duration: "random(30, 60)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[-1] overflow-hidden bg-[#020617]"
      aria-hidden="true"
    />
  );
};

export default GsapBackground;
