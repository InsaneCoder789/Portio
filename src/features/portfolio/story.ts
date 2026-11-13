// The home page told as a story. Short on purpose: the full write-ups live on the projects page.

export const premise = {
  statement: "Build it. Break it. Understand it. Then build it better.",
  lead: "I'm Rohan, a full-stack and Android engineer studying computer science at KIIT. Most of what I make has to survive bad connections, retries and people in a hurry.",
  note: "That is how every project below was made: shipped, pushed until it failed, then rebuilt around the failure.",
  bio: "I work across backend, web and Android, with TypeScript, Kotlin, FastAPI and PostgreSQL. Alongside the projects I am Vice President of CyberVault KIIT and Deputy Chief of technology at K-1000.",
  status: "Open to software engineering roles and internships.",
};

export const disciplines = ["Offline-first payments", "Android", "Backend systems", "On-device ML", "Operations software", "Full-stack web"];

// `project` must match a name in featuredProjects: it supplies the cover and the link.
export const reel = [
  {
    project: "Rail",
    statement: "A payment that survives a dead connection.",
    detail: "Rail takes the payment offline and replays it when the phone reconnects. Both go through one pipeline, so a retry never pays twice.",
  },
  {
    project: "OfflineQR Attendance",
    statement: "Attendance with no internet in the room.",
    detail: "Each scan is signed on the student's phone and kept there. The server checks every one before the roster changes.",
  },
  {
    project: "Lakshman-Rekha",
    statement: "A warning before the scam works.",
    detail: "It reads the call, the notifications and the screen together, and steps in at the moment of decision. Everything runs on the device.",
  },
  {
    project: "IncidentLens",
    statement: "An answer you can check.",
    detail: "Logs, screenshots, metrics and runbooks, read together. Every finding cites its evidence, and a person approves anything that touches production.",
  },
  {
    project: "StayPilot",
    statement: "One room, one truth, every desk.",
    detail: "Checkout ends the stay, expires the key and books housekeeping in a single step, across several hotels.",
  },
  {
    project: "ClassSync",
    statement: "Every deadline, kept on the phone.",
    detail: "Google Classroom and Gmail feed one planner with reminders and a home-screen widget. It needs no server.",
  },
  {
    project: "KYLR",
    statement: "Paying someone should feel calm.",
    detail: "An Android payments app where every transaction state is explicit, so the screen never has to guess what happened.",
  },
  {
    project: "MGHSIS",
    statement: "See the crowd before it becomes a crush.",
    detail: "A prototype that feeds wearables, CCTV and gate counts into a stadium digital twin. It advises, and people decide.",
  },
  {
    project: "K1000",
    statement: "A research programme you can walk through.",
    detail: "The K-1000 website: domains, leadership, events and applications in one interface, built to be reused.",
  },
];

// Real pixel sizes of each cover, so every image is shown whole at its own proportions.
export const coverSize: Record<string, [number, number]> = {
  "/projects/rail-header.png": [1600, 819],
  "/projects/lakshman-rekha-header.png": [1600, 888],
  "/projects/k1000-platform-header.png": [1800, 983],
  "/projects/kylr-header.png": [1600, 800],
  "/projects/incidentlens-cover.webp": [1600, 900],
  "/projects/staypilot-cover.webp": [1600, 900],
  "/projects/classsync-header.png": [1691, 930],
  "/projects/mghsis-cover.webp": [1600, 900],
  "/projects/offlineqr-header.png": [1672, 941],
};

// Taken from the two résumés. `line` is the front-page sentence; `points` is the full version on the profile page.
export const roles = [
  {
    org: "Red Kite Productions",
    role: "ReactJS Architect Intern",
    kind: "Internship",
    when: "Apr to Jul 2026",
    line: "Designed a game's core flow and outcomes, and the progression between its stages.",
    points: [
      "Designed the game's core flow and outcomes, defining progression between stages and planning how the concept would be executed.",
      "Structured the gameplay experience so it could guide both design and development.",
    ],
  },
  {
    org: "Donum",
    role: "Junior Software Developer and Marketing Intern",
    kind: "Internship",
    when: "Aug 2025 to Aug 2026",
    line: "Designed Donum's website frontends and advised on company initiatives.",
    points: [
      "Designed website frontends for Donum.",
      "Contributed strategic recommendations on company initiatives, combining hands-on interface design with advisory and planning support.",
    ],
  },
  {
    org: "CyberVault KIIT",
    role: "Vice President",
    kind: "Leadership",
    when: "Sep 2026 to now",
    line: "Lead the society's strategy and event operations across its technical and organising teams.",
    points: [
      "Lead society strategy and event operations.",
      "Set priorities, responsibilities and timelines, coordinating the technical and organising teams.",
    ],
  },
  {
    org: "K-1000 KIIT",
    role: "Deputy Chief, Office of Technology and Innovation",
    kind: "Leadership",
    when: "May 2025 to now",
    line: "Built the official K-1000 website and the Ignithon 2.0 portal, used to organise 101 teams and 350+ participants.",
    points: [
      "Developed and deployed the official K-1000 website with React.js and Next.js.",
      "Built the Ignithon 2.0 organising-committee portal and helped organise 101 teams and 350+ participants.",
      "Joined in May 2025 and progressed through software development and strategy roles to Deputy Chief in the Junior Executive Council in July 2026.",
    ],
  },
  {
    org: "GeeksforGeeks KIIT",
    role: "Android Developer",
    kind: "Student organisation",
    when: "Jan 2026 to now",
    line: "Kotlin apps with REST APIs, asynchronous data loading and modular logic.",
    points: [
      "Developing Kotlin applications with REST APIs, asynchronous data loading and modular logic.",
      "Supporting debugging and mobile performance work.",
    ],
  },
];

// Two résumés, two orientations.
export const tracks = [
  {
    id: "backend",
    label: "Backend and full-stack",
    title: "Backend and full-stack developer",
    summary:
      "Backend projects built with TypeScript, Python and PostgreSQL: APIs, transactional workflows and offline synchronisation, backed by concurrency and recovery tests. React and Next.js on the front.",
    projects: "Rail, OfflineQR Attendance, IncidentLens, StayPilot",
    skills: [
      ["Languages", "TypeScript, Python, JavaScript, Kotlin"],
      ["Backend and APIs", "Node.js, Express.js, FastAPI, REST APIs, authentication, API design"],
      ["Frontend", "React.js, Next.js, Tailwind CSS"],
      ["Data and reliability", "PostgreSQL, Redis, Prisma, pgvector, idempotency, async processing, RAG"],
      ["Tools", "Git, GitHub Actions, Postman, Firebase, Supabase"],
    ],
    file: "/resume-backend-full-stack.pdf",
    preview: "/resume-backend-full-stack.png",
    forRoles: "Written for backend and full-stack roles",
    story:
      "This one is for teams where the hard part is the server. It opens with APIs, transactions and what happens when a request is retried or a connection drops, and it backs each claim with the tests that prove it: concurrency, conflicting retries and lost-response recovery.",
    work: [
      ["Rail", "Internal-wallet transfers that cannot be duplicated when a client retries after losing the response."],
      ["OfflineQR Attendance", "Signed attendance proofs recorded offline and synchronised through a durable outbox."],
      ["IncidentLens", "Incident reports built from logs, documents, screenshots and voice notes, with every claim cited."],
      ["StayPilot", "Reservations, check-in, housekeeping and billing for several hotels, with transactional payments."],
    ],
  },
  {
    id: "android",
    label: "Android",
    title: "Android developer, Kotlin and Jetpack Compose",
    summary:
      "Native Android apps with Kotlin, Jetpack Compose, Room and WorkManager: offline-first workflows, background sync, and on-device OCR and classification, backed by automated tests and build pipelines.",
    projects: "ClassSync, Folio, NavGate, Lakshman Rekha",
    skills: [
      ["Languages", "Kotlin, Python, TypeScript, JavaScript"],
      ["Android", "Jetpack Compose, ViewModel, Coroutines, Room, DataStore, WorkManager"],
      ["Vision and ML", "CameraX, OpenCV, ML Kit, TensorFlow Lite, on-device classification"],
      ["APIs and data", "REST APIs, Google Classroom, Gmail integration, Firebase, PostgreSQL"],
      ["Tools and web", "Git, GitHub Actions, Postman, React.js, Next.js"],
    ],
    file: "/resume-android.pdf",
    preview: "/resume-android.png",
    forRoles: "Written for Android roles",
    story:
      "This one is for teams shipping native apps. It opens with Kotlin and Jetpack Compose, then the parts of Android that are easy to get wrong: local storage, background sync, the camera and on-device models. Every project on it runs on a phone.",
    work: [
      ["ClassSync", "An offline-first planner that pulls from Google Classroom and Gmail. In Google Play closed testing."],
      ["Folio", "A document scanner with perspective correction, on-device OCR and searchable PDF export."],
      ["NavGate", "Place search, route preview, guidance and rerouting across map and AR-assist screens."],
      ["Lakshman Rekha", "Scam warnings from notification and accessibility signals, scored on the device."],
    ],
  },
];

export const facts = [
  ["Studying", "B.Tech in Computer Science and Engineering at KIIT, Bhubaneswar. 2024 to 2028."],
  ["Recognition", "Second place at ScamBust, Kshitij, IIT Kharagpur (2026), for the team project Lakshman Rekha."],
  ["Certified", "HackerRank: Frontend Developer (React) and Software Engineer Intern, May 2026."],
];

