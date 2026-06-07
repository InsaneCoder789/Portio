import { Blocks, BrainCircuit, RadioTower, Route, ServerCog, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const principles = [
  {
    icon: Blocks,
    title: "Across the stack",
    copy: "From user-facing applications to backend systems and developer workflows.",
  },
  {
    icon: BrainCircuit,
    title: "Built for reality",
    copy: "I care about how software behaves outside ideal demos: under load, failure, and change.",
  },
  {
    icon: RadioTower,
    title: "Systems depth",
    copy: "Actively deepening my understanding of distributed systems and software architecture.",
  },
  {
    icon: ShieldCheck,
    title: "Reliability first",
    copy: "Interested in systems that handle scale and failure with clarity rather than accidental complexity.",
  },
];

const focusAreas = [
  "Backend systems and architecture",
  "End-to-end product development",
  "Scalable system design",
  "Mobile, web, and backend exploration",
];

const toolkit = ["Kotlin", "TypeScript", "React Native", "Node.js", "FastAPI", "Express.js", "REST APIs"];

export function AboutSection() {
  return (
    <section id="about-me" className="w-full">
      <div className="section-frame about-frame relative overflow-hidden px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
        <div className="about-orbit about-orbit-one" aria-hidden="true" />
        <div className="about-orbit about-orbit-two" aria-hidden="true" />

        <div className="about-heading relative grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-end">
          <div>
            <p className="about-eyebrow text-[0.68rem] uppercase tracking-[0.42em]">01 / About me</p>
            <p className="about-index mt-5 font-['Outfit'] text-[clamp(5rem,12vw,11rem)] font-semibold leading-[0.72] tracking-[-0.1em]">
              01
            </p>
          </div>
          <div className="space-y-5">
            <p className="about-kicker text-sm uppercase tracking-[0.28em]">Software developer · systems thinker · product builder</p>
            <h2 className="about-title max-w-5xl font-['Outfit'] text-[clamp(3rem,6.5vw,6.7rem)] font-semibold leading-[0.88] tracking-[-0.075em]">
              I build software that stays useful when the{" "}
              <span>real world gets involved.</span>
            </h2>
          </div>
        </div>

        <Separator className="about-separator my-8 sm:my-10" />

        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.65fr)]">
          <Card className="about-manifesto portfolio-card portfolio-card-strong overflow-hidden">
            <CardContent className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:p-8">
              <div className="space-y-6">
                <p className="about-lead text-lg leading-9 sm:text-xl">
                  Software Developer with hands-on experience in Android, Flutter, backend systems, and modern web
                  technologies. I build scalable mobile applications and system-oriented products with a strong interest
                  in architecture, UI/UX engineering, and production-ready execution.
                </p>
                <p className="about-copy text-base leading-8">
                  Through K1000 and student technical organizations, I have contributed to technical leadership, event
                  management, and cross-functional collaboration. I explore different kinds of projects not only to ship
                  them, but to understand how they should be designed, tested, and maintained in production.
                </p>
                <div className="flex flex-wrap gap-2">
                  {toolkit.map((item) => (
                    <Badge key={item} variant="outline" className="about-badge px-3 py-2 text-[0.62rem] uppercase tracking-[0.22em]">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="about-principles grid gap-px sm:grid-cols-2 lg:grid-cols-1">
                {principles.map(({ icon: Icon, title, copy }) => (
                  <div key={title} className="about-principle group grid grid-cols-[2.75rem_1fr] gap-4 p-4">
                    <div className="about-principle-icon flex h-11 w-11 items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-['Outfit'] text-lg font-semibold tracking-[-0.04em]">{title}</h3>
                      <p className="mt-1 text-sm leading-6">{copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            <Card className="about-focus portfolio-card overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <ServerCog className="h-5 w-5" />
                  <p className="text-[0.65rem] uppercase tracking-[0.32em]">What I&apos;m focused on</p>
                </div>
                <div className="mt-6 space-y-0">
                  {focusAreas.map((focus, index) => (
                    <div key={focus} className="about-focus-row flex items-center gap-4 border-t py-4 first:border-t-0 first:pt-0">
                      <span className="font-mono text-xs tabular-nums">0{index + 1}</span>
                      <strong className="font-['Outfit'] text-lg font-semibold tracking-[-0.035em]">{focus}</strong>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="about-philosophy portfolio-card overflow-hidden">
              <CardContent className="relative p-6">
                <Route className="about-philosophy-icon absolute right-5 top-5 h-8 w-8" />
                <p className="text-[0.65rem] uppercase tracking-[0.32em]">Philosophy</p>
                <blockquote className="mt-10 font-['Outfit'] text-3xl font-semibold leading-tight tracking-[-0.055em] sm:text-4xl">
                  “Build it. Break it. Understand it. Then build it better.”
                </blockquote>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
