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
      "Developed reusable frontend components and centralized state handling to improve maintainability across multiple pages.",
      "Worked on responsive UI optimization, frontend performance improvements, and rapid prototyping workflows."
    ],
    skills: ["Next.js", "TypeScript", "Node.js", "Performance Optimization"],
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
      "Worked on branding assets, UI-focused promotional systems, and technical communication strategies.",
      "Collaborated on marketing workflows integrating design coordination with product visibility initiatives."
    ],
    skills: ["React.js", "UI/UX", "Branding Assets", "Technical Communication"],
  },
  {
    company: "K-1000",
    logo: publicAsset("logos/companies/k1000.jpg"),
    role: "Software Developer & Strategy Associate (Student Organization)",
    type: "Full-time",
    duration: "May 2025 — Present",
    location: "Bhubaneswar, Odisha",
    mode: "On-site",
    points: [
      "Developing Android and Flutter applications with reusable UI structures and backend-integrated mobile workflows.",
      "Developed and deployed the official K1000 website using React.js and Next.js for organizational platforms and event initiatives.",
      "Integrated REST APIs, asynchronous data handling, and dynamic frontend rendering across internal systems.",
      "Contributed to technical coordination, event execution, operational planning, and platform management across multiple organizational initiatives."
    ],
    skills: ["Project Management", "Strategic Planning", "Leadership"],
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
      "Integrated REST APIs, asynchronous data loading, and backend-driven UI rendering for production-like workflows.",
      "Worked on debugging, performance optimization, and responsive mobile interaction handling."
    ],
    skills: ["Kotlin", "Modular Architecture", "REST APIs", "Debugging"],
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
