import { EXPERIENCE, PROFILE_PHOTO } from "@/data/linkedin";
import { publicAsset } from "@/lib/utils";
import type { ProjectCard } from "@/components/portfolio/types";

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
  heroPrimary: publicAsset("transparent1.png"),
  heroSecondary: publicAsset("transparent2.png"),
};

export const featuredProjects: ProjectCard[] = [
  {
    name: "Rail",
    headerImage: publicAsset("projects/rail-header.png"),
    headerImageAlt: "Rail offline payment orchestration architecture",
    headerImagePosition: "center top",
    headerImageTone: "default",
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
    headerImage: publicAsset("projects/lakshman-rekha-header.png"),
    headerImageAlt: "Lakshman Rekha mobile scam protection product overview",
    headerImagePosition: "center center",
    headerImageTone: "default",
    awardTagline: "🥈 IITKGP Hackathon Winner",
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
    headerImage: publicAsset("projects/k1000-platform-header.png"),
    headerImageAlt: "K-1000 student platform systems interface",
    headerImagePosition: "center center",
    headerImageTone: "default",
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
    name: "ClassSync",
    headerImage: publicAsset("projects/classsync-header.png"),
    headerImageAlt: "ClassSync academic planner mobile product overview",
    headerImagePosition: "center center",
    headerImageTone: "cool",
    description:
      "Built an Android academic planner focused on turning classes, tasks, study blocks, and exam prep into one calm, tightly structured daily system.",
    details:
      "Designed the experience around timetable-aware planning, progress visibility, reminder workflows, and a cleaner study dashboard that keeps academic planning readable under daily pressure.",
    challenge:
      "Student productivity tools often become cluttered very quickly, so the challenge was building something that stays focused, structured, and genuinely useful without overwhelming the user.",
    outcome:
      "Shaped ClassSync into an Android-first academic hub where schedules, tasks, progress, and study planning feel unified rather than fragmented across separate utility screens.",
    learning:
      "Productivity UI only feels premium when information hierarchy removes stress instead of adding more panels, labels, and urgency than the user needs.",
    stack: ["Android", "Kotlin", "Jetpack Compose"],
    githubUrl: "https://github.com/InsaneCoder789/ClassSync",
  },
];

export const experienceItems = EXPERIENCE.filter(
  (item) => !item.company.toLowerCase().includes("national service scheme"),
).sort((left, right) => {
  if (left.company === "K-1000") return -1;
  if (right.company === "K-1000") return 1;
  return 0;
});

export type AchievementEntry = {
  title: string;
  category: string;
  year: string;
  metric?: string;
  summary: string;
  details: string[];
  image?: string;
  imageAlt?: string;
};

export const achievementItems: AchievementEntry[] = [
  {
    title: "Goldman Sachs India Hackathon",
    category: "Competitive build signal",
    year: "2026",
    metric: "Rank 851 / 14,000",
    summary:
      "Placed in the top competitive bracket of the Goldman Sachs India Hackathon 2026, finishing 851st out of roughly 14,000 contestants.",
    details: [
      "Competed in a large-scale engineering setting where speed, reasoning quality, and implementation clarity mattered under pressure.",
      "The result became a strong external signal for problem-solving depth and consistency in high-volume competitive environments.",
    ],
  },
  {
    title: "ScamBust Hackathon · IIT Kharagpur",
    category: "Hackathon podium",
    year: "2026",
    metric: "Second place",
    image: publicAsset("achievements/iit-kharagpur-scampbust.png"),
    imageAlt: "Indian Institute of Technology Kharagpur building lit in pink at night",
    summary:
      "Finished second at ScamBust during Kshitij, IIT Kharagpur, where Lakshman Rekha emerged as a pressure-tested scam-safety concept shaped around real behavioral risk scenarios.",
    details: [
      "Lakshman Rekha earned the silver finish by translating scam-detection thinking into a product direction that felt practical, preventive, and immediately relevant.",
      "The event stood out because it rewarded applied judgment rather than conventional demo theatrics, which made it a strong validation point for the product idea itself.",
    ],
  },
  {
    title: "Smart India Hackathon Volunteer",
    category: "Operational leadership",
    year: "2025",
    image: publicAsset("achievements/smart-india-hackathon-certificate.png"),
    imageAlt: "Smart India Hackathon 2025 volunteer certificate for Rohan Chatterjee",
    summary:
      "Volunteered behind the scenes for Smart India Hackathon 2025, supporting event operations and helping the environment stay smooth for participating teams and organizers.",
    details: [
      "Contributed to the core functioning of the event by supporting processes, coordination, and execution discipline.",
      "What stayed with me most was hearing teams explain their ideas firsthand and seeing innovation emerge through conversation and collaboration.",
    ],
  },
  {
    title: "Student Representative · K-1000",
    category: "Community leadership",
    year: "2026",
    summary:
      "Represented K-1000 at the Mega Blood Donation Camp at KIIT, contributing to a large student-led community initiative centered around responsibility and service.",
    details: [
      "The experience strengthened my confidence in people-facing organizational work, not just technical execution.",
      "It reinforced the value of showing up for initiatives that create visible social impact beyond the screen.",
    ],
  },
  {
    title: "NSS Happiness Concert 2K26",
    category: "Stage and culture",
    year: "2026",
    image: publicAsset("achievements/nss-happiness-concert.png"),
    imageAlt: "Group photo from NSS Happiness Concert 2K26 at night",
    summary:
      "Performed at Happiness Concert 2K26 through the National Service Scheme, contributing to an event built around energy, atmosphere, and collective experience.",
    details: [
      "Being on stage added a different dimension to public-facing confidence, performance under attention, and collaborative event execution.",
      "It remains one of the clearest reminders that creative presence and technical seriousness can coexist well.",
    ],
  },
  {
    title: "Directed NSS Awareness Short Film",
    category: "Creative direction",
    year: "2026",
    image: publicAsset("achievements/nss-short-film.png"),
    imageAlt: "Behind-the-scenes still from the NSS awareness short film shoot",
    summary:
      "Directed a short film on mental health and drug abuse awareness for an NSS event, guiding the project from concept to final edited narrative.",
    details: [
      "Worked closely with actors, editors, and seniors to turn an important subject into something emotionally coherent and publicly meaningful.",
      "The project deepened my appreciation for storytelling, coordination, and the responsibility that comes with shaping public-facing messaging.",
    ],
  },
];

export const contactContent = {
  email: "chatterjeerohan0204@gmail.com",
  instagram: "https://instagram.com/rochiee24",
  linkedin: "https://linkedin.com/in/rochiee24",
  github: "https://github.com/InsaneCoder789",
};

export const githubUsername = "InsaneCoder789";

export const skillsMatrix = [
  { label: "C", logo: publicAsset("logos/c.svg") },
  { label: "Dart", logo: publicAsset("logos/dart.svg") },
  { label: "Java", logo: publicAsset("logos/java.svg") },
  { label: "HTML5", logo: publicAsset("logos/html.svg") },
  { label: "Python", logo: publicAsset("logos/python.svg") },
  { label: "TypeScript", logo: publicAsset("logos/typescript.svg") },
  { label: "Vercel", logo: publicAsset("logos/vercel.svg") },
  { label: "Firebase", logo: publicAsset("logos/firebase.svg") },
  { label: "Google Cloud", logo: publicAsset("logos/google-cloud.svg") },
  { label: "TailwindCSS", logo: publicAsset("logos/tailwindcss.svg") },
  { label: "React Router", logo: publicAsset("logos/react-router.svg") },
  { label: "React", logo: publicAsset("logos/react.svg") },
  { label: "OpenCV", logo: publicAsset("logos/opencv.svg") },
  { label: "Next.js", logo: publicAsset("logos/nextjs.svg") },
  { label: "Node.js", logo: publicAsset("logos/nodejs.svg") },
  { label: "Flutter", logo: publicAsset("logos/flutter.svg") },
  { label: "FastAPI", logo: publicAsset("logos/fastapi.svg") },
  { label: "Express.js", logo: publicAsset("logos/express.svg") },
  { label: "MongoDB", logo: publicAsset("logos/mongodb.svg") },
  { label: "Kotlin", logo: publicAsset("logos/kotlin.svg") },
  { label: "MySQL", logo: publicAsset("logos/mysql.svg") },
  { label: "Postgres", logo: publicAsset("logos/postgresql.svg") },
  { label: "Redis", logo: publicAsset("logos/redis.svg") },
  { label: "SQLite", logo: publicAsset("logos/sqlite.svg") },
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
