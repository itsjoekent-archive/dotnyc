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
    </div>
  );
}