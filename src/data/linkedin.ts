// Edit this file anytime to update Experience / Volunteering shown on the site.
// Images are in public folder and referenced by path
import { publicAsset } from "@/lib/utils";

export interface ExperienceItem {
  company: string;
  logo: string;
  role: string;
  type: string; // Full-time / Part-time / Internship
  duration: string;
  location: string;
  mode: string; // On-site / Remote / Hybrid
  description?: string;
  points?: string[];
  skills?: string[];
}

export const PROFILE_PHOTO = publicAsset("profile-portrait.webp");

export const EXPERIENCE: ExperienceItem[] = [
  {
    company: "Red Kite Productions",
    logo: publicAsset("logos/companies/redkite-square.jpeg"),
    role: "ReactJS Architect Intern (Part-Time)",
    type: "Internship",
    duration: "Apr 2026 — Present",
    location: "Remote",
    mode: "Part-time",
    points: [
      "Building a Next.js-based frontend platform using React.js, TypeScript, and Node.js for dynamic content rendering and modular UI management.",
      "Refactored page-level composition into reusable interface systems so new screens and content modules could be introduced without visual drift.",
      "Worked closely with content and product direction to translate broad creative asks into implementation-ready frontend structures.",
      "Developed reusable frontend components and centralized state handling to improve maintainability across multiple pages.",
      "Worked on responsive UI optimization, frontend performance improvements, and rapid prototyping workflows.",
      "Reviewed interaction quality, implementation consistency, and shipping readiness before internal handoff."
    ],
    skills: ["Next.js", "TypeScript", "Node.js", "Architecture", "Performance Optimization"],
  },
  {
    company: "Donum Technologies",
    logo: publicAsset("logos/companies/donum-square.jpeg"),
    role: "Junior Software Developer & Marketing Intern",
    type: "Internship",
    duration: "Aug 2025 — Present",
    location: "Mumbai, Maharashtra",
    mode: "Hybrid",
    points: [
      "Assisted in frontend improvements and digital product presentation for additive-manufacturing campaigns.",
      "Helped align interface presentation, product communication, and landing-page direction so technical offerings could be explained more clearly.",
      "Worked on branding assets, UI-focused promotional systems, and technical communication strategies.",
      "Collaborated on marketing workflows integrating design coordination with product visibility initiatives.",
      "Supported campaign execution by shaping assets, layouts, and messaging into more structured product-facing outputs."
    ],
    skills: ["React.js", "UI/UX", "Branding Assets", "Technical Communication", "Product Positioning"],
  },
  {
    company: "K-1000",
    logo: publicAsset("logos/companies/k1000.jpg"),
    role: "Deputy Chief | Office of Technology & Innovation",
    type: "Full-time",
    duration: "May 2025 — Present",
    location: "Bhubaneswar, Odisha",
    mode: "On-site",
    points: [
      "Acting as the second-in-command of K-1000's Office of Technology & Innovation, helping manage the technical backbone behind websites, internal tools, event systems, dashboards, automation flows, and innovation-led execution.",
      "Supported the Chief of OTI in planning, building, maintaining, and improving K-1000's technical infrastructure across web platforms, member systems, operational tooling, and branch support requests.",
      "Reviewed technical feasibility for proposed digital systems by evaluating scalability, security, delivery effort, resource constraints, and implementation realism before work moved forward.",
      "Contributed directly to development, debugging, code review, feature refinement, and launch-readiness for systems used before and during events.",
      "Helped translate cross-branch requirements into actionable technical plans by coordinating with teams that needed registration portals, dashboards, workflow systems, and operational tooling.",
      "Guided technical execution through documentation, progress monitoring, internal coordination, system reliability checks, and continuous exploration of automation ideas, AI tools, and infrastructure improvements."
    ],
    skills: ["Technical Leadership", "Feasibility Review", "System Planning", "Cross-Branch Coordination", "Documentation"],
  },
  {
    company: "Geeks for Geeks KIIT",
    logo: publicAsset("logos/companies/gfg-kiit.jpg"),
    role: "Android Developer (Student Organization)",
    type: "Student Organization",
    duration: "Jan 2026 — Present",
    location: "Bhubaneswar, Odisha",
    mode: "Remote",
    points: [
      "Developing Android applications using Kotlin with modular activity structures and maintainable application logic.",
      "Structured features around cleaner activity boundaries and reusable patterns so the codebase stayed easier to debug and extend.",
      "Integrated REST APIs, asynchronous data loading, and backend-driven UI rendering for production-like workflows.",
      "Worked on debugging, performance optimization, and responsive mobile interaction handling.",
      "Collaborated with the team on implementation decisions, release stability, and improvements to day-to-day development flow."
    ],
    skills: ["Kotlin", "Modular Architecture", "REST APIs", "Debugging", "Mobile Performance"],
  },
  {
    company: "National Service Scheme (NSS SCE KIIT)",
    logo: publicAsset("logos/companies/nss.jpg"),
    role: "Student Volunteer",
    type: "Internship",
    duration: "June 2025 — Present",
    location: "KIIT, Bhubaneswar",
    mode: "On-site",
    points: [
      "Directed and coordinated a short film on mental health awareness and drug abuse prevention for NSS initiatives and public awareness campaigns.",
      "Participated in orphanage outreach, hygiene awareness programs, educational science activities, and cultural engagement initiatives including stage performances and public events."
    ],
  },
];

export const VOLUNTEERING: ExperienceItem[] = [];
