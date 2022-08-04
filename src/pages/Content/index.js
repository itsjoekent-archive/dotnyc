import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useContent } from '../../utils/ContentContext';
import './content.css';

export default function Content() {
  const content = useContent();

  return (
    <div className="content">
      <div className="ct-title">
        <h1>{content?.title}</h1>
        {content?.subtitle && <p>{content?.subtitle}</p>}
      </div>
      <div className="ct-section-list">
        {Object.keys(content?.sections || {}).map((key) => {
          const data = content.sections[key];

          switch (data.type) {
            case 'cover':
              return (
                <img
                  key={key}
                  className="ct-cover"
                  src={data.coverSrc}
                  alt={data.coverAlt}
                />
              );

            case 'markdown':
              return (
                <div key={key} className="ct-markdown ct-text">
                  <ReactMarkdown>{data.markdown}</ReactMarkdown>
                </div>
              );

            case 'panel':
              return (
                <div key={key} className="ct-panel">
                  <img src={data.imageSrc} alt={data.imageAlt} />
                  <div className="ct-panel__markdown ct-text">
                    <ReactMarkdown>{data.markdown}</ReactMarkdown>
                  </div>
                </div>
              );

            case 'video':
              return (
                <video key={key} className="ct-video" controls muted>
                  <source type="video/mp4" src={data.videoSrc} />
                </video>
              );

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}