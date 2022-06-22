import React from 'react';
import Section from './Section';
import { useContent } from '../../utils/ContentContext';
import './homepage.css';

export default function Homepage(props) {
  const content = useContent();

  const additionalWork = React.useMemo(() => {
    const fullTime = (content?.additionalWork?.fulltime || []).join(', ');
    const freelance = (content?.additionalWork?.freelance || []).join(', ');
    return `Full-time: ${fullTime}. Freelance: ${freelance}.`;
  }, [content]);

  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000';

    // Adopted from: https://en.wikipedia.org/wiki/Lorenz_system

    let particle = [0, 1, 10];
    let requestId = null;
    let iterations = 0;

    function chaos(state) {
      const [x, y, z] = state;
      
      return [
        x + 0.015 * -6 * (x - y),
        y + 0.015 * (-x * z + 28 * x - y),
        z + 0.015 * (x * y - z),
      ];
    }

    function draw() {
      if (window.screen.width < 900) {
        requestId = null;
        return;
      }

      const [x0, y0, z0] = particle;
      particle = chaos(particle);

      const [x1, y1, z1] = particle;
      ctx.strokeStyle = `hsl(${Math.abs(x1) * 10}, 50%, 50%)`;

      const left = canvas.width * .66;
      const top = canvas.height / 2;
      const scale = 15;

      ctx.beginPath();
      ctx.moveTo(left + x0 * scale, top + y0 * scale);
      ctx.lineTo(left + x1 * scale, top + y1 * scale);
      ctx.stroke();

      iterations++;

      if (iterations < 10000) {
        requestId = window.requestAnimationFrame(draw);
      }
    }

    function onWindowResize() {
      resizeCanvas();

      if (!requestId) {
        requestId = window.requestAnimationFrame(draw);
      }
    }

    resizeCanvas();
    requestId = window.requestAnimationFrame(draw);
    window.addEventListener('resize', onWindowResize);

    return () => {
      window.cancelAnimationFrame(requestId);
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  return (
    <div className="homepage">
      <div className="hp-section-list">
        {Object.keys(content?.sections || {}).map((key) => (
          <Section key={key} {...content.sections[key]} />
        ))}
      </div>
      <div className="hp-additional-work">
        <h2>Additional work not displayed</h2>
        <p>{additionalWork}</p>
      </div>
      <canvas className="hp-art" ref={canvasRef} />
    </div>
  );
}