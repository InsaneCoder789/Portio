import { EXPERIENCE, PROFILE_PHOTO } from "@/data/linkedin";
import { publicAsset } from "@/lib/utils";

export const heroContent = {
  name: "Rohan Chatterjee",
  role: "Full Stack Engineer",
  current:
    "Currently open to software engineering roles, product-focused internships, and ambitious builds across web, backend, and Android.",
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
    challenge:
      "Needed a backend model that could preserve payment intent, authorization rules, and replay-safe execution even when devices reconnect late or retry aggressively.",
    outcome:
      "Shaped Rail as a control-and-execution layer that handles offline initiation, bounded authorization, queue replay, and ledger visibility without pretending to replace settlement rails.",
    learning:
      "The biggest lesson was that reliability in fintech UX comes as much from state design and idempotency discipline as from the API layer itself.",
    stack: ["TypeScript", "Sync Engine", "Resilience"],
    githubUrl: "https://github.com/InsaneCoder789/Rail",
  },
  {
    name: "Lakshman-Rekha",
    description:
      "Built an Android safety application focused on scam and phishing detection during calls and messaging workflows with contextual warning systems.",
    details:
      "Combined lightweight behavior analysis with a hybrid ML and rule-based detection pipeline to balance precision, device performance, and privacy-conscious interaction design.",
    challenge:
      "Wanted to protect users during the moment of decision, not after damage was already done, while staying lightweight enough for day-to-day device use.",
    outcome:
      "Built an Android-first safety layer that monitors risky interaction patterns and surfaces contextual warnings before users commit to unsafe actions.",
    learning:
      "Trust-oriented mobile products need to feel protective without becoming noisy, intrusive, or performance-heavy.",
    stack: ["Android", "Kotlin", "Security"],
    githubUrl: "https://github.com/InsaneCoder789/Lakshman-Rekha",
  },
  {
    name: "K1000",
    description:
      "Developed a React and Next.js platform with reusable component systems and responsive layouts for organizational operations, events, and content workflows.",
    details:
      "Improved maintainability through modular UI structuring, deployment optimization, and standardized rendering patterns across high-frequency internal pages.",
    challenge:
      "The platform needed to support recurring organizational activity without turning into a one-off website that breaks every time content structure changes.",
    outcome:
      "Moved the experience toward a maintainable UI system with reusable sections, standardized rendering, and deployment-ready patterns for repeated internal use.",
    learning:
      "A good frontend system is not just visual consistency — it is repeatability, maintainability, and resilience under changing content pressure.",
    stack: ["Next.js", "React", "UI Architecture"],
    githubUrl: "https://github.com/InsaneCoder789/K1000",
  },
  {
    name: "KYLR",
    description:
      "Built a high-trust Android payments experience focused on clean money movement flows, sharp visual hierarchy, and confidence-first interaction design.",
    details:
      "Structured the app around UPI-oriented transaction states, responsive dashboard surfaces, and production-minded mobile architecture that keeps the experience fast and readable.",
    challenge:
      "Payments UX had to communicate trust instantly while keeping transactional states readable and interaction paths calm under pressure.",
    outcome:
      "Created a Kotlin-based Android experience around clear transaction states, dashboard clarity, and confidence-first visual hierarchy for money movement flows.",
    learning:
      "In fintech interfaces, visual calm and structural clarity often matter as much as the underlying technical execution.",
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

export const writingNotes = [
  {
    title: "Designing Rail For Retry-Safe Offline Execution",
    summary:
      "Notes on authorization windows, replay-safe backend execution, and why payment reliability is often a state-machine problem before it is a UI problem.",
    status: "Drafting now",
  },
  {
    title: "What Makes An Interface Feel Trustworthy",
    summary:
      "A working note on confidence-first hierarchy, calmer fintech surfaces, and how interaction tone changes user trust in transactional flows.",
    status: "Publishing soon",
  },
  {
    title: "Reusable Frontend Systems For Student-Led Platforms",
    summary:
      "A breakdown of how modular UI structure, predictable rendering patterns, and deployment discipline helped K1000 scale beyond a one-off website.",
    status: "In progress",
  },
];

export const portfolioSignals = [
  {
    title: "Open for strong-fit roles",
    description:
      "Available for software engineering roles, product-focused internships, and serious collaboration across web, backend, and Android systems.",
  },
  {
    title: "Core working lanes",
    description:
      "Most effective in frontend systems, backend coordination, Android delivery, and product interfaces that need both structure and taste.",
  },
  {
    title: "Execution style",
    description:
      "Fast iteration, reusable architecture, calm interface decisions, and technical communication that stays clear under pressure.",
  },
  {
    title: "What I optimize for",
    description:
      "Maintainability, trust, interface clarity, and systems that continue to feel stable when real users, changing content, and scaling pressure arrive.",
  },
];

export const credibilitySignals = [
  {
    title: "Collaboration mode",
    description:
      "Product-minded engineering with equal attention to structure, execution clarity, and how the work is communicated to users.",
  },
  {
    title: "Delivery environments",
    description:
      "Hands-on across internships, student organizations, platform builds, Android applications, and design-sensitive frontend systems.",
  },
  {
    title: "References",
    description:
      "Direct references and collaboration context can be shared during serious conversations and role-based discussions.",
  },
];
