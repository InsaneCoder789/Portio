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
  heroPrimary: publicAsset("transparent1.png"),
  heroSecondary: publicAsset("transparent2.png"),
};

export const aboutContent = {
  eyebrow: "01 / About",
  command: "~ /about --systems --product --execution",
  title: "Software that stays useful when the real world gets involved.",
  lead:
    "Software Developer with hands-on experience in Android, Flutter, backend systems, and modern web technologies. Skilled in Kotlin, TypeScript, React Native, Node.js, FastAPI, Express.js, and RESTful API development, with experience building scalable mobile applications and system-oriented projects.",
  body:
    "Contributed to technical leadership, event management, and cross-functional collaboration through multiple roles at K1000 and student technical organizations. Passionate about software architecture, scalable systems, UI/UX engineering, and real-world product development.",
  points: [
    "I build across the stack, from user-facing applications to backend systems and developer workflows.",
    "I care about how software behaves in real-world environments, not just in ideal demos.",
    "I am actively deepening my understanding of system design, distributed systems, and software architecture.",
    "I am interested in building systems that handle scale, failure, and reliability with clarity.",
    "I enjoy working on different kinds of projects, not just to ship them, but to understand how they should be designed, tested, and maintained in production.",
  ],
  focus: [
    "Backend systems and architecture",
    "End-to-end product development",
    "Scalable system design",
    "Exploring technologies across mobile, web, and backend",
  ],
  philosophy: "Build it. Break it. Understand it. Then build it better.",
};

export const featuredProjects = [
  {
    name: "Rail",
    analysis: "Authorization-first execution separates permission to spend from the actual transfer. PostgreSQL stores reservations, token headroom, idempotency records, and ledger events; both immediate execution and reconnect-time replay use the same pipeline. The architectural value is consistency across retries—not replacing a bank or claiming production payment readiness.",
    preview: publicAsset("projects/rail-header.png"),
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
    analysis: "The app treats scams as a sequence of pressure and actions rather than an isolated suspicious message. Call context, notifications, and on-screen signals feed deterministic risk scoring alongside on-device ML. User-selected protection modes change the response, while the model supplies signals instead of directly blocking people. Permission handling and false-positive behavior remain important validation areas.",
    preview: publicAsset("projects/lakshman-rekha-header.png"),
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
    analysis: "The README describes an immersive research-program interface: a neural boot sequence, six domain panels, leadership, event galleries, and application pathways. Typed content and reusable navigation connect the cinematic layer to useful information. Simulated telemetry is presentation, not live organizational data; the engineering challenge is keeping the 3D experience readable and responsive.",
    preview: publicAsset("projects/k1000-platform-header.png"),
    description:
      "Developed an immersive React and Next.js research-program website connecting domains, leadership, events, and student application pathways through a reusable interface system.",
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
    analysis: "Jetpack Compose and StateFlow connect onboarding, bank discovery, contact search, and amount entry to explicit payment state. The documented KylrVault pipeline isolates balance and ledger updates from screen composition. This creates a useful separation between interface confidence and transaction logic; the README's compliance ambitions are not independent certification or proof of live banking integration.",
    preview: publicAsset("projects/kylr-header.png"),
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
  {
    name: "IncidentLens",
    analysis: "An investigation follows evidence intake, normalization, retrieval, agent reasoning, and operator review. Stable citations let engineers inspect the basis of a recommendation; durable jobs expose progress, retries, and cancellation. Persisted traces track tool calls, latency, and cost. Human approval separates investigation from production mutation, and synthetic evaluation still needs real-incident validation.",
    preview: publicAsset("projects/incidentlens-cover.webp"),
    description: "An incident intelligence workspace that turns fragmented operational evidence into citation-grounded investigations for SRE teams.",
    details: "Multimodal ingestion, hybrid retrieval, specialized investigation agents, durable jobs, and evaluation traces share one approval-aware workflow.",
    challenge: "Make logs, screenshots, documents, metrics, and runbooks useful together without letting unsupported model claims become production actions.",
    outcome: "The repository implements evidence processing, persisted reports and traces, a PostgreSQL job ledger, Redis workers, and human approval boundaries for production-changing recommendations.",
    learning: "Design takeaway: a trustworthy AI interface needs inspectable evidence, visible failures, and explicit action boundaries—not just an answer box.",
    stack: ["Next.js", "FastAPI", "pgvector", "Redis"],
    githubUrl: "https://github.com/InsaneCoder789/IncidentLens",
  },
  {
    name: "StayPilot",
    analysis: "A room is shared operational state, not just a dashboard tile. Checkout ends the stay, expires credentials, marks the room dirty, and creates turnover work in one transaction. Property-scoped APIs and role checks protect the same records across teams; serializable financial operations keep payments and invoices aligned. Physical NFC integration requires compatible hardware and a configured connector.",
    preview: publicAsset("projects/staypilot-cover.webp"),
    description: "A multi-property hotel operating system connecting reservations, front desk, room readiness, housekeeping, billing, payments, and guest access.",
    details: "Property-scoped APIs and PostgreSQL-backed workflows keep departments aligned around the same guest, room, and financial records.",
    challenge: "Keep check-in, checkout, payment, access credentials, and room turnover consistent instead of letting each department operate a disconnected dashboard.",
    outcome: "The implementation coordinates checkout, credential expiry, and housekeeping work transactionally, with serializable payment operations, role boundaries, and audit history.",
    learning: "Design takeaway: operational UX gets simpler when the underlying state transitions agree across departments.",
    stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
    githubUrl: "https://github.com/InsaneCoder789/StayPilot",
  },
  {
    name: "ClassSync",
    analysis: "Google Classroom, optional Gmail, and manual input converge into locally stored events and tasks. Hard rules protect trusted deadlines and exam signals, while confidence policy decides when TensorFlow Lite can assist. Room and DataStore feed Compose views, reminders, and the widget without a custom backend. The documented Android release is closed testing, not evidence of broad adoption.",
    preview: publicAsset("projects/classsync-header.png"),
    description: "A local-first Android academic workspace bringing Google Classroom, optional Gmail updates, manual tasks, study planning, and reminders together.",
    details: "Jetpack Compose sits above Room and DataStore. A hybrid rules-and-TensorFlow-Lite pipeline classifies academic updates, with safe rule-based fallback when inference is unavailable.",
    challenge: "Turn mixed academic signals into useful tasks without losing trusted deadlines or making the student workflow depend on a custom backend.",
    outcome: "The app provides planner and exam views, local reminders, a homescreen widget, and confidence-aware classification. The repository links an Android closed-testing release.",
    learning: "Design takeaway: on-device intelligence is most useful when deterministic rules protect critical academic signals and local state remains the foundation.",
    stack: ["Kotlin", "Jetpack Compose", "Room", "TensorFlow Lite"],
    githubUrl: "https://github.com/InsaneCoder789/ClassSync",
  },
  {
    name: "MGHSIS",
    analysis: "Wearable, CCTV, and gate observations pass through validated ingestion into shared live state and durable history. Zone feature fusion produces advisory risk, contributing reasons, and operator actions; the Digital Twin lets people compare simulated interventions. Synthetic model scores do not establish field safety accuracy. Sensor calibration, independent safety review, and human authorization remain essential.",
    preview: publicAsset("projects/mghsis-cover.webp"),
    description: "An SIH2026 mass-gathering safety prototype combining wearable telemetry, CCTV observations, and gate events in a stadium Digital Twin.",
    details: "FastAPI ingestion, Redis live state, PostgreSQL history, explainable risk engines, and a crowd-risk model support human-authorized intervention simulation.",
    challenge: "Help operators understand crowd accumulation, potential distress, and population inconsistencies across fragmented sensor streams.",
    outcome: "The prototype includes live and simulated twin views, alert triage, replay, and before-and-after intervention scoring. Synthetic evaluation is not evidence of field safety performance.",
    learning: "Design takeaway: safety interfaces must expose reasons and uncertainty while keeping decisions with people. Hardware integration and field calibration remain deployment boundaries.",
    stack: ["Next.js", "FastAPI", "Redis", "scikit-learn"],
    githubUrl: "https://github.com/InsaneCoder789/SIH2026-MGHSIS",
  },
  {
    name: "OfflineQR Attendance",
    analysis: "A rotating signed classroom challenge becomes a device-signed proof stored atomically in a local outbox. On reconnection, the server rechecks signatures, enrollment, device status, timing, and duplicate rules before updating the roster. ICT governance handles controlled device replacement. This supports delayed verification, not a guarantee against physical collusion; institution-specific identity and device rollout checks remain required.",
    preview: publicAsset("projects/offlineqr-header.png"),
    description: "An offline-first attendance ecosystem connecting a Flutter student app, a faculty portal, device governance, and centrally verified attendance proofs.",
    details: "Rotating signed QR challenges, device-bound Ed25519 proofs, a durable SQLite outbox, and idempotent synchronization preserve valid scans through connectivity loss.",
    challenge: "Capture attendance without Internet access while keeping device identity, replay rules, and delayed reconciliation verifiable across mobile and server implementations.",
    outcome: "The repository implements offline proof capture, backend re-verification, faculty roster updates, and controlled device replacement. Institutional identity, integrity attestation, and physical-device rollout checks remain required.",
    learning: "Design takeaway: offline-first UX works when local capture is durable and the server independently verifies evidence after reconnecting—not when offline state is treated as unquestioned truth.",
    stack: ["Flutter", "Next.js", "FastAPI", "Ed25519"],
    githubUrl: "https://github.com/InsaneCoder789/offlineqr-attendance",
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
