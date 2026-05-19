import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

const AnimeSystemVisualizer = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = ''; // Clear previous

    const columns = 14;
    const rows = 12;
    const total = columns * rows;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < total; i++) {
      const dot = document.createElement('div');
      dot.className = 'w-1 h-1 rounded-full bg-primary/20 dot';
      fragment.appendChild(dot);
    }

    container.appendChild(fragment);

    animate('.dot', {
      scale: [0.1, 1],
      opacity: [0.1, 0.5],
      delay: stagger(150, { grid: [columns, rows], from: 'center' }),
      loop: true,
      direction: 'alternate',
      easing: 'easeInOutQuad'
    });

    return () => {
      // In v4, cleanup might be different, but let's try to just let it be or find a stop method
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
      <div 
        ref={containerRef} 
        className="grid grid-cols-14 grid-rows-12 gap-4 w-full h-full p-4"
      />
    </div>
  );
};

export default AnimeSystemVisualizer;
