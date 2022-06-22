import React from 'react';
import { Link } from 'wouter';

export default function Section(props) {
  const {
    type = 'ladder',
    imageSrc = '',
    imageAlt = '',
    header = '',
    headerElementType = 'h2',
    subheader = '',
    linkLabel = 'Read more',
    linkTarget = '',
  } = props;

  const Header = React.useMemo(() => {
    return () => React.createElement(headerElementType, {}, header);
  }, [header, headerElementType]);

  return (
    <section className={`section --${type}`}>
      <img alt={imageAlt} src={imageSrc} />
      <div className="hp-details">
        <div className="hp-details-content">
          {!!header && <Header />}
          {!!subheader && <p>{subheader}</p>}
        </div>
        <Link href={linkTarget}>{linkLabel}</Link>
      </div>
    </section>
  );
}