import { useCallback } from 'react';
import { Link } from 'wouter';
import copy from 'copy-to-clipboard';
import home from './home.png';
import './index.css';

export default function Navigation() {
  const onEmailClick = useCallback(() => {
    copy('hey@joekent.nyc');
    alert('Copied to clipboard!');
  }, []);

  return (
    <nav className="navigation">
      <Link href="/">
        <img src={home} alt="New York City Brownstone" />
      </Link>
      <div className="navigation__links">
        <button onClick={onEmailClick}>Email</button>
        <a
          href="https://www.linkedin.com/in/joe-kent-63170077/"
          target="_blank"
        >
          LinkedIn
        </a>
        <a href="https://twitter.com/itsjoekent" target="_blank">
          Twitter
        </a>
        <a href="https://www.tiktok.com/@itsjoekent" target="_blank">
          TikTok
        </a>
        <a href="https://instagram.com/itsjoekent" target="_blank">
          Instagram
        </a>
      </div>
    </nav>
  );
}
