type ProjectCardProps = {
  name: string;
  blurb: string;
  stack: string[];
  href: string;
};

const ProjectCard = ({ name, blurb, stack, href }: ProjectCardProps) => {
  return (
    <a className="project-card reveal" href={href} target="_blank" rel="noreferrer">
      <p className="project-label">Project</p>
      <h3 className="project-name">{name}</h3>
      <p className="project-blurb">{blurb}</p>
      <div className="project-stack">
        {stack.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </a>
  );
};

export default ProjectCard;
