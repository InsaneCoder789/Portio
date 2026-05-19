import { useRef, useEffect, useState, useMemo } from "react"; 
import { motion, useScroll, useSpring } from "framer-motion";
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Briefcase, 
  Code2, 
  Menu, 
  X, 
  ArrowRight
} from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import SkillBar from "@/components/SkillBar";
import TechLogosSection from "@/components/TechLogosSection";
import ExperienceItem from "@/components/ExperienceItem";
import GithubContributions from "@/components/GithubContributions";
import AnimeSystemVisualizer from "@/components/AnimeSystemVisualizer";
import GsapBackground from "@/components/GsapBackground";
import CyberGrid from "@/components/CyberGrid";
import KaliBootScreen from "@/components/KaliBootScreen";
import { EXPERIENCE, VOLUNTEERING, PROFILE_PHOTO } from "@/data/linkedin";
import { useGithubRepos } from "@/hooks/useGithub";
import { publicAsset } from "@/lib/utils";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);
  const [isBooted, setIsBooted] = useState(() => {
    if (typeof window !== "undefined") {
      return !!sessionStorage.getItem("booted");
    }
    return false;
  });
  
  const handleBootComplete = () => {
    setIsBooted(true);
    sessionStorage.setItem("booted", "true");
  };
  
  const aboutRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const repoNames = useMemo(() => ["NavGate", "Rail", "Lakshman-Rekha", "K1000"], []);
  const { repos, loading: reposLoading } = useGithubRepos("InsaneCoder789", repoNames);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsMenuOpen(false);
  };

  if (!isBooted) {
    return <KaliBootScreen onComplete={handleBootComplete} />;
  }

  return (
    <div className="min-h-screen text-white selection:bg-primary/20 selection:text-primary">
      <GsapBackground />
      <CyberGrid />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative w-11 h-11 rounded-full overflow-hidden border border-primary/30 bg-primary/20 group-hover:scale-110 transition-all duration-500 shadow-[0_0_20px_rgba(var(--primary),0.3)]">
              {photoFailed ? (
                <div className="w-full h-full flex items-center justify-center font-black text-black bg-primary">RC</div>
              ) : (
                <img
                  src={PROFILE_PHOTO}
                  alt="Rohan"
                  className="w-full h-full object-cover"
                  onError={() => setPhotoFailed(true)}
                  referrerPolicy="no-referrer"
                />
              )}
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-primary text-[8px] font-black text-black leading-none">RC</span>
            </div>
            <div className="flex flex-col">
              <span className="font-outfit font-black tracking-[-0.05em] text-2xl leading-none group-hover:text-primary transition-colors">ROHAN CHATTERJEE</span>
              <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/30 hidden sm:block mt-1">System Architect • Full Stack</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {[
              { label: "Experience", ref: experienceRef },
              { label: "Projects", ref: projectsRef },
              { label: "Skills", ref: skillsRef },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => scrollTo(item.ref)}
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-primary transition-colors"
              >
                {item.label}
              </button>
            ))}
            <button 
              onClick={() => scrollTo(contactRef)}
              className="px-6 py-2.5 bg-primary text-white text-[11px] font-bold uppercase tracking-widest rounded-full hover:scale-105 transition-all"
            >
              Contact
            </button>
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 bg-black pt-32 px-10 transition-transform duration-500 md:hidden ${isMenuOpen ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="flex flex-col gap-8">
          {[
            { label: "Experience", ref: experienceRef },
            { label: "Projects", ref: projectsRef },
            { label: "Skills", ref: skillsRef },
            { label: "Contact", ref: contactRef },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => scrollTo(item.ref)}
              className="text-4xl font-black uppercase tracking-tighter text-left hover:text-primary transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 space-y-32">
        {/* Hero Section */}
        <section className="min-h-[60vh] flex flex-col justify-center items-start gap-12 relative overflow-hidden">
          <AnimeSystemVisualizer />
          <div className="flex flex-col lg:flex-row gap-16 items-center relative z-10">
            <div className="relative group shrink-0">
               <div className="absolute -inset-4 bg-primary/20 rounded-[48px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
               <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-[40px] overflow-hidden border border-primary/20 bg-black shadow-[0_0_50px_-12px_hsl(var(--primary)/0.3)] group-hover:border-primary/50 transition-all duration-500">
                 {photoFailed ? (
                    <div className="w-full h-full flex items-center justify-center text-8xl">🧑‍💻</div>
                 ) : (
                    <img 
                      src={PROFILE_PHOTO} 
                      alt="Rohan" 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                      onError={() => setPhotoFailed(true)} 
                      referrerPolicy="no-referrer"
                    />
                 )}
                 <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                 <div className="absolute bottom-6 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               </div>
            </div>

            <div className="text-center lg:text-left space-y-8 max-w-3xl">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-[11px] font-black uppercase tracking-[0.2em]">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Full Stack Engineer
              </div>
              <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black tracking-tighter leading-[0.85] uppercase font-outfit">
                <div className="flex flex-col">
                  <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>Engineering</motion.span>
                  <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-white/10">
                    Scalable
                  </motion.span>
                  <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>Systems.</motion.span>
                </div>
              </h1>
              <p className="text-lg sm:text-xl text-white/50 max-w-2xl leading-relaxed">
                Full Stack Engineer experienced in mobile applications, backend systems, and frontend engineering using Kotlin, Flutter, React Native, Next.js, FastAPI, and Node.js.
              </p>
              <div className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start">
                <button onClick={() => scrollTo(contactRef)} className="px-10 py-5 bg-primary text-white font-bold uppercase tracking-widest text-xs rounded-2xl hover:scale-105 transition-all shadow-2xl shadow-primary/20 flex items-center gap-3">
                  Get In Touch <ArrowRight className="w-4 h-4" />
                </button>
                <a href={publicAsset("Rohan_Chatterjee_Resume.pdf")} target="_blank" className="px-10 py-5 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-xs rounded-2xl hover:bg-white/10 transition-colors">
                  Resume
                </a>
              </div>
            </div>
          </div>
          
          <div className="cyber-glass p-8 sm:p-12 rounded-[40px] space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/20">About Me</h3>
            <p className="text-lg sm:text-2xl font-medium text-white/70 leading-relaxed font-outfit max-w-5xl">
              Full Stack Engineer experienced in mobile applications, backend systems, and frontend engineering using Kotlin, Flutter, React Native, Next.js, FastAPI, and Node.js. Built system-oriented applications involving real-time interactions, offline workflows, API integrations, and production grade deployments. Interested in software engineering, distributed systems, and product-focused development.
            </p>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" ref={experienceRef} className="space-y-16">
          <div className="flex flex-col gap-4">
            <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">01. Experience</span>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase font-outfit">Career Nodes</h2>
          </div>
          <div className="grid gap-8">
            {EXPERIENCE.map((exp, i) => (
              <ExperienceItem key={exp.company + exp.role} item={exp} delay={i * 0.1} />
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" ref={projectsRef} className="space-y-16">
          <div className="flex flex-col gap-4">
            <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">02. Projects</span>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase font-outfit">Selected Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {reposLoading ? (
               Array.from({ length: 4 }).map((_, i) => (
                 <div key={i} className="h-[400px] rounded-[40px] bg-white/[0.02] border border-white/5 animate-pulse" />
               ))
             ) : (
               repos.map((project, i) => (
                 <ProjectCard 
                    key={project.name}
                    name={project.name}
                    description={project.description}
                    tech={project.language ? [project.language, ...project.topics] : project.topics}
                    url={project.html_url}
                    stars={project.stargazers_count}
                    delay={i * 0.1}
                 />
               ))
             )}
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" ref={skillsRef} className="space-y-16">
          <div className="flex flex-col gap-4">
            <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">03. Skills</span>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase font-outfit">Capability Matrix</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-12">
              <TechLogosSection />
              <GithubContributions delay={1.6} />
            </div>
            <div className="space-y-8 cyber-glass p-10 rounded-[40px]">
              <h3 className="text-xs font-black tracking-[0.3em] text-white/20 uppercase mb-8">Performance Benchmarks</h3>
              {[
                { name: "Next.js / React", level: 94 },
                { name: "Kotlin / Android", level: 89 },
                { name: "Flutter / Dart", level: 86 },
                { name: "TypeScript", level: 92 },
              ].map((skill, i) => (
                <SkillBar key={skill.name} name={skill.name} level={skill.level} delay={i * 0.1} />
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" ref={contactRef} className="py-20">
          <div className="relative p-12 sm:p-20 rounded-[64px] bg-primary text-black overflow-hidden group">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/20 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-1000" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
              <div className="max-w-2xl text-center lg:text-left">
                <h2 className="text-5xl sm:text-8xl font-black tracking-tighter mb-8 leading-none uppercase font-outfit">Ready for the Next Level?</h2>
                <p className="text-black/60 font-bold uppercase tracking-widest text-sm mb-10">Currently open to internship opportunities and high-impact projects.</p>
                <div className="flex items-center gap-4 justify-center lg:justify-start">
                   <div className="w-3 h-3 rounded-full bg-black animate-ping" />
                   <span className="text-[11px] font-black uppercase tracking-widest text-black/40">Uplink Status: Ready</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-4 w-full lg:w-auto">
                <a href="mailto:chatterjeerohan0204@gmail.com" className="px-12 py-7 bg-black text-white font-bold uppercase tracking-widest text-xs rounded-3xl hover:scale-105 transition-all text-center">
                  Start Conversation
                </a>
                <div className="flex items-center justify-center gap-8 mt-4">
                  <a href="https://linkedin.com/in/rochiee24" target="_blank" className="text-black/40 hover:text-black font-black text-[11px] uppercase tracking-widest transition-colors">LinkedIn</a>
                  <a href="https://github.com/InsaneCoder789" target="_blank" className="text-black/40 hover:text-black font-black text-[11px] uppercase tracking-widest transition-colors">Github</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-20 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-8 opacity-40 hover:opacity-100 transition-opacity">
          <div className="text-[11px] font-bold uppercase tracking-[0.5em] text-white/20">
            ROHAN CHATTERJEE • {new Date().getFullYear()}
          </div>
          <div className="flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.3em] text-white/20">
            <span className="flex items-center gap-2 italic lowercase font-mono">/root/system_stable</span>
            <span className="hidden sm:block">Mumbai, IN</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
