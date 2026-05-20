import { EXPERIENCE, PROFILE_PHOTO } from "@/data/linkedin";
import { publicAsset } from "@/lib/utils";

export const heroContent = {
  name: "Rohan Chatterjee",
  role: "Full Stack Engineer",
  intro:
    "I engineer software systems that are reliable in production, intentional in UX, and scalable under real usage. My focus sits at the intersection of product thinking and systems discipline.",
  summary:
    "Across frontend, backend, and Android domains, I work with Next.js, Express.js, React, Kotlin, Jetpack Compose, Android SDK tools, MySQL, and PostgreSQL to build fast, maintainable platforms with clear technical architecture.",
  profilePhoto: PROFILE_PHOTO,
};

export const featuredProjects = [
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
    name: "K1000",
    description:
      "Developed a React and Next.js platform with reusable component systems and responsive layouts for organizational operations, events, and content workflows.",
    details:
      "Improved maintainability through modular UI structuring, deployment optimization, and standardized rendering patterns across high-frequency internal pages.",
    stack: ["Next.js", "React", "UI Architecture"],
    githubUrl: "https://github.com/InsaneCoder789/K1000",
  },
  {
    name: "KYLR",
    description:
      "Built a high-trust Android payments experience focused on clean money movement flows, sharp visual hierarchy, and confidence-first interaction design.",
    details:
      "Structured the app around UPI-oriented transaction states, responsive dashboard surfaces, and production-minded mobile architecture that keeps the experience fast and readable.",
    stack: ["Android", "Kotlin", "Fintech UX"],
    githubUrl: "https://github.com/InsaneCoder789/KYLR",
  },
];

export const experienceItems = EXPERIENCE.filter(
  (item) => !item.company.toLowerCase().includes("national service scheme"),
);

export const contactContent = {
  email: "chatterjeerohan0204@gmail.com",
  instagram: "https://instagram.com/rochiee24",
  linkedin: "https://linkedin.com/in/rochiee24",
  github: "https://github.com/InsaneCoder789",
};

export const githubUsername = "InsaneCoder789";

export const skillsMatrix = [
  { label: "C" },
  { label: "Dart" },
  { label: "Java" },
  { label: "HTML5", logo: publicAsset("logos/html.svg") },
  { label: "Python", logo: publicAsset("logos/python.svg") },
  { label: "TypeScript", logo: publicAsset("logos/typescript.svg") },
  { label: "Vercel" },
  { label: "Firebase", logo: publicAsset("logos/firebase.svg") },
  { label: "Google Cloud" },
  { label: "TailwindCSS" },
  { label: "React Router" },
  { label: "React", logo: publicAsset("logos/react.svg") },
  { label: "OpenCV" },
  { label: "Next.js" },
  { label: "Node.js" },
  { label: "Flutter" },
  { label: "FastAPI" },
  { label: "Express.js" },
  { label: "MongoDB" },
  { label: "Kotlin", logo: publicAsset("logos/kotlin.svg") },
  { label: "MySQL", logo: publicAsset("logos/mysql.svg") },
  { label: "Postgres", logo: publicAsset("logos/postgresql.svg") },
  { label: "Redis" },
  { label: "SQLite" },
  { label: "Git", logo: publicAsset("logos/git.svg") },
  { label: "JavaScript", logo: publicAsset("logos/javascript.svg") },
  { label: "CSS", logo: publicAsset("logos/css.svg") },
  { label: "C++", logo: publicAsset("logos/cpp.svg") },
  { label: "Tcl", logo: publicAsset("logos/tcl.svg") },
];

export const performanceBenchmarks = [
  { name: "Next.js / React", value: 94 },
  { name: "Kotlin / Android", value: 89 },
  { name: "MySQL / PostgreSQL", value: 87 },
  { name: "TypeScript", value: 92 },
];
