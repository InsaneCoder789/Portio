import { EXPERIENCE, PROFILE_PHOTO } from "@/data/linkedin";
import { publicAsset } from "@/lib/utils";

export const heroContent = {
  name: "Rohan Chatterjee",
  role: "Full Stack Engineer",
  intro:
    "I engineer software systems that are reliable in production, intentional in UX, and scalable under real usage. My focus sits at the intersection of product thinking and systems discipline.",
  summary:
    "Across mobile, backend, and frontend domains, I work with Kotlin, React, Next.js, FastAPI, Node.js, MySQL, and PostgreSQL to build fast, maintainable platforms with clear technical architecture.",
  profilePhoto: PROFILE_PHOTO,
};

export const featuredProjects = [
  {
    name: "NavGate",
    description:
      "Built a React Native navigation platform with real-time route rendering, location-aware UI updates, and optimized map interaction handling for smoother movement across dense screens.",
    details:
      "Implemented modular navigation state management, asynchronous GPS processing, and performance guardrails to reduce unnecessary rerenders in continuous tracking flows.",
    stack: ["React Native", "TypeScript", "Realtime UX"],
    githubUrl: "https://github.com/InsaneCoder789/NavGate",
  },
  {
    name: "Rail",
    description:
      "Designed an offline-first payment orchestration service with deferred synchronization pipelines that maintain operational continuity during unstable network conditions.",
    details:
      "Implemented retry-safe transaction execution, local persistence with reconciliation, and resilient queue-based processing inspired by distributed settlement systems.",
    stack: ["TypeScript", "Sync Engine", "Resilience"],
    githubUrl: "https://github.com/InsaneCoder789/Rail",
  },
  {
    name: "Lakshman-Rekha",
    description:
      "Built an Android safety application focused on scam and phishing detection during calls and messaging workflows with contextual warning systems.",
    details:
      "Combined lightweight behavior analysis with a hybrid ML and rule-based detection pipeline to balance precision, device performance, and privacy-conscious interaction design.",
    stack: ["Android", "Kotlin", "Security"],
    githubUrl: "https://github.com/InsaneCoder789/Lakshman-Rekha",
  },
  {
    name: "K1000 Platform",
    description:
      "Developed a React and Next.js platform with reusable component systems and responsive layouts for organizational operations, events, and content workflows.",
    details:
      "Improved maintainability through modular UI structuring, deployment optimization, and standardized rendering patterns across high-frequency internal pages.",
    stack: ["Next.js", "React", "UI Architecture"],
    githubUrl: "https://github.com/InsaneCoder789/K1000",
  },
];

export const experienceItems = EXPERIENCE;

export const contactContent = {
  email: "chatterjeerohan0204@gmail.com",
  instagram: "https://instagram.com/rochiee24",
  linkedin: "https://linkedin.com/in/rochiee24",
  github: "https://github.com/InsaneCoder789",
};

export const githubUsername = "InsaneCoder789";

export const skillsMatrix = [
  { label: "React", logo: publicAsset("logos/react.svg") },
  { label: "TypeScript", logo: publicAsset("logos/typescript.svg") },
  { label: "Kotlin", logo: publicAsset("logos/kotlin.svg") },
  { label: "MySQL", logo: publicAsset("logos/mysql.svg") },
  { label: "PostgreSQL", logo: publicAsset("logos/postgresql.svg") },
  { label: "Firebase", logo: publicAsset("logos/firebase.svg") },
  { label: "Python", logo: publicAsset("logos/python.svg") },
  { label: "Linux", logo: publicAsset("logos/linux.svg") },
  { label: "Git", logo: publicAsset("logos/git.svg") },
  { label: "JavaScript", logo: publicAsset("logos/javascript.svg") },
  { label: "HTML", logo: publicAsset("logos/html.svg") },
  { label: "CSS", logo: publicAsset("logos/css.svg") },
];

export const performanceBenchmarks = [
  { name: "Next.js / React", value: 94 },
  { name: "Kotlin / Android", value: 89 },
  { name: "MySQL / PostgreSQL", value: 87 },
  { name: "TypeScript", value: 92 },
];
