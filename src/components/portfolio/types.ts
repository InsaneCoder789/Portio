export type GithubProfile = {
  public_repos: number;
  followers: number;
  following: number;
  bio: string | null;
};

export type GithubRepo = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
};

export type GithubContributionDay = {
  date: string;
  count: number;
  level?: number;
};

export type GithubContributionWeek = GithubContributionDay[];

export type GithubContributionGrid = {
  weeks: GithubContributionWeek[];
  monthLabels: Array<{ index: number; label: string }>;
};

export type ProjectCard = {
  name: string;
  headerImage?: string;
  headerImageAlt?: string;
  headerImagePosition?: string;
  description: string;
  details: string;
  challenge?: string;
  outcome?: string;
  learning?: string;
  stack: string[];
  githubUrl: string;
  homepage?: string | null;
  stars?: number;
  language?: string | null;
};

export type SkillItem = {
  label: string;
  logo?: string;
  count?: number;
};
