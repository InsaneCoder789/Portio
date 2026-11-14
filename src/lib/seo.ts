import { contactContent, featuredProjects } from "@/features/portfolio/content";
import { tracks } from "@/features/portfolio/story";
import { projectSlug } from "@/lib/projects";

// The address Vercel serves this project from; falls back to localhost when run on a laptop.
export const SITE = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000";
export const NAME = "Rohan Chatterjee";

export const DESCRIPTION =
  "Rohan Chatterjee is a full-stack and Android engineer in Bhubaneswar who builds offline-first payments, on-device safety tools and operations software that keeps working when the network doesn't. Nine projects, five roles and two résumés.";

export const KEYWORDS = [
  "Rohan Chatterjee", "software engineer", "full-stack developer", "Android developer", "Kotlin", "Jetpack Compose", "TypeScript",
  "Next.js", "PostgreSQL", "offline-first", "backend engineer", "KIIT", "Bhubaneswar", "portfolio",
];

const GITHUB = contactContent.github, LINKEDIN = contactContent.linkedin;

export const person = {
  "@type": "Person",
  "@id": `${SITE}/#person`,
  name: NAME,
  url: SITE,
  image: `${SITE}/transparent1.png`,
  jobTitle: "Software engineer",
  description: "Full-stack and Android engineer building offline-first payments, on-device safety tools and operations software.",
  address: { "@type": "PostalAddress", addressLocality: "Bhubaneswar", addressCountry: "IN" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Kalinga Institute of Industrial Technology (KIIT)" },
  sameAs: [GITHUB, LINKEDIN],
  knowsAbout: ["Kotlin", "Jetpack Compose", "TypeScript", "Next.js", "PostgreSQL", "Redis", "FastAPI", "Offline-first systems", "Idempotent APIs"],
};

const graph = (...nodes: object[]) => ({ "@context": "https://schema.org", "@graph": nodes });

const crumbs = (...trail: [string, string][]) => ({
  "@type": "BreadcrumbList",
  itemListElement: [["Home", "/"] as [string, string], ...trail].map(([name, path], index) => ({ "@type": "ListItem", position: index + 1, name, item: `${SITE}${path}` })),
});

export const homeLd = graph(
  { "@type": "WebSite", "@id": `${SITE}/#website`, url: SITE, name: NAME, description: DESCRIPTION, inLanguage: "en", publisher: { "@id": `${SITE}/#person` } },
  person,
);

export const aboutLd = graph(
  { "@type": "ProfilePage", "@id": `${SITE}/about#page`, url: `${SITE}/about`, name: `Profile | ${NAME}`, mainEntity: { "@id": `${SITE}/#person` }, isPartOf: { "@id": `${SITE}/#website` } },
  person,
  crumbs(["Profile", "/about"]),
);

export const projectsLd = graph(
  {
    "@type": "CollectionPage", "@id": `${SITE}/projects#page`, url: `${SITE}/projects`, name: `Projects | ${NAME}`, isPartOf: { "@id": `${SITE}/#website` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: featuredProjects.map((project, index) => ({
        "@type": "ListItem", position: index + 1, url: `${SITE}/projects#${projectSlug(project.name)}`,
        item: { "@type": "SoftwareSourceCode", name: project.name, description: project.description, codeRepository: project.githubUrl, author: { "@id": `${SITE}/#person` } },
      })),
    },
  },
  person,
  crumbs(["Projects", "/projects"]),
);

export const resumesLd = graph(
  {
    "@type": "CollectionPage", "@id": `${SITE}/resumes#page`, url: `${SITE}/resumes`, name: `Résumés | ${NAME}`, isPartOf: { "@id": `${SITE}/#website` },
    hasPart: tracks.map((track) => ({ "@type": "DigitalDocument", name: `${NAME}, ${track.label} résumé`, encodingFormat: "application/pdf", url: `${SITE}${track.file}`, author: { "@id": `${SITE}/#person` } })),
  },
  person,
  crumbs(["Résumés", "/resumes"]),
);

// Safe to place inside a script tag: a "<" can never close it.
export const ld = (data: object) => JSON.stringify(data).replace(/</g, "\\u003c");
