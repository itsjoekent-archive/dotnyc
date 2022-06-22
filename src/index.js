import { createRoot } from 'react-dom/client';
import { App } from './App';

import './index.css';
import './reset.css';

(async function () {
  try {
    const initialContent = process.env.NODE_ENV === 'production' ? { [`${window.location.pathname}`]: window.PAGE_DATA } : {};

    const container = document.getElementById('app');
    const root = createRoot(container);
    root.render(<App initialContent={initialContent} />);
  } catch (error) {
    console.error(error);
  }
})();
