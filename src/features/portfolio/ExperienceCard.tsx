type ExperienceCardProps = {
  company: string;
  role: string;
  duration: string;
  logo: string;
  points?: string[];
};

const ExperienceCard = ({ company, role, duration, logo, points = [] }: ExperienceCardProps) => {
  return (
    <article className="xp-card reveal">
      <div className="xp-logo-wrap">
        <img src={logo} alt={company} className="xp-logo" referrerPolicy="no-referrer" />
      </div>
      <div className="xp-body">
        <p className="xp-company">{company}</p>
        <h3 className="xp-role">{role}</h3>
        <p className="xp-duration">{duration}</p>
        <ul className="xp-points">
          {points.slice(0, 2).map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>
    </article>
  );
};

export default ExperienceCard;
