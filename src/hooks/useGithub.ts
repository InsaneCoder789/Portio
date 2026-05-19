import { useState, useEffect } from 'react';

export interface GithubRepo {
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  language: string;
  topics: string[];
}

const REPO_DESCRIPTIONS: Record<string, string> = {
  "Rail": "Designed an offline-first transaction orchestration system using asynchronous synchronization queues and retry-based consistency handling for unstable network environments. Implemented fault tolerant transaction workflows with local persistence and deferred reconciliation to maintain operational continuity during intermittent connectivity. Built modular transaction processing pipelines inspired by distributed payment settlement architectures and backend synchronization systems.",
  "Lakshman-Rekha": "Built a real-time digital safety application focused on identifying phishing attempts, scam patterns, and suspicious interaction behavior during calls and messaging workflows. Developed Android-native protection systems with contextual warning generation, lightweight behavioral analysis, and an in-house ML-based detection pipeline combined with rule-based protection logic for dual-layer scam prevention, while maintaining responsive mobile performance and privacy-focused interaction design.",
  "K1000": "Developed a React.js and Next.js web platform featuring reusable UI components, responsive layouts, and centralized frontend rendering workflows for organizational digital systems. Worked on frontend optimization, deployment configuration, and modular interface structuring to improve maintainability and reduce repetitive UI implementation across multiple pages.",
  "NavGate": "Built a React Native navigation platform with real-time route rendering, location-aware UI updates, and optimized map interaction handling. Implemented modular navigation state management and asynchronous GPS update processing for responsive route tracking workflows. Focused on minimizing unnecessary rerenders, maintaining smooth navigation performance, and improving interaction responsiveness during continuous location updates."
};

export function useGithubRepos(username: string, repoNames: string[]) {
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRepos() {
      try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          const filtered = data
            .filter((repo: { name: string }) => repoNames.includes(repo.name))
            .map((repo: { name: string; description: string; html_url: string; stargazers_count: number; language: string; topics: string[] }) => ({
              name: repo.name,
              description: REPO_DESCRIPTIONS[repo.name] || repo.description || "No description provided.",
              html_url: repo.html_url,
              stargazers_count: repo.stargazers_count,
              language: repo.language,
              topics: repo.topics || [],
            }));
          
          // Keep the order as specified in repoNames
          const sorted = repoNames.map(name => filtered.find(r => r.name === name)).filter(Boolean) as GithubRepo[];
          setRepos(sorted);
        }
      } catch (error) {
        console.error("Error fetching GitHub repos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
  }, [username, repoNames.join(',')]);

  return { repos, loading };
}
