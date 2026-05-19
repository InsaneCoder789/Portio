import { introSlides } from "@/features/portfolio/content";

const repeatedRows = [
  2,
  3,
  4,
  5,
  4,
  3,
  2,
];

const featureRows = [
  introSlides.featureWords.slice(0, 2),
  introSlides.featureWords.slice(2, 5),
  introSlides.featureWords.slice(5, 9),
  introSlides.featureWords.slice(1, 4),
  introSlides.featureWords.slice(7, 10),
];

const IntroStage = () => {
  return (
    <section className="intro-stage" aria-label="Intro animation stage">
      <div className="slide slide-a">
        {repeatedRows.map((count, rowIndex) => (
          <div key={count + rowIndex} className="row">
            {Array.from({ length: count }).map((_, columnIndex) => {
              const centerIndex = Math.floor(count / 2);
              const isCenter = rowIndex === 3 && columnIndex === centerIndex;

              return (
                <p key={`${rowIndex}-${columnIndex}`} className={isCenter ? "center" : undefined}>
                  {isCenter ? introSlides.centerWord : introSlides.repeatedWord}
                </p>
              );
            })}
          </div>
        ))}
      </div>

      <div className="slide slide-b features">
        {featureRows.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((word) => (
              <p key={word}>{word}</p>
            ))}
          </div>
        ))}
      </div>

      <div className="slide slide-c">
        <p>{introSlides.closingLine}</p>
      </div>
    </section>
  );
};

export default IntroStage;
