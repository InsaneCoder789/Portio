import { featuredProjects } from "@/features/portfolio/content";

const ProjectsScene = () => {
  return (
    <section className="story-section" id="projects">
      <div className="section-header">
        <p>Projects</p>
        <h2>Mission Logs</h2>
      </div>

      <div className="projects-scene-grid">
        {featuredProjects.map((project) => (
          <a key={project.name} href={project.href} target="_blank" rel="noreferrer" className="project-panel scene-card">
            <div className="project-square" />
            <p className="project-name">{project.name}</p>
            <span className="project-blurb">{project.blurb}</span>
            <div className="project-tags">
              {project.stack.map((tag) => (
                <small key={tag}>{tag}</small>
              ))}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default ProjectsScene;
