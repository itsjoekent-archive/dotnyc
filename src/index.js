import { createRoot } from 'react-dom/client';
import { App } from './App';
import loadContent from './utils/loadContent';

import './index.css';
import './reset.css';

async function fetchAllContent() {
  const { pages } = await import('../content/_sitemap.toml');
  const contentPromises = pages.map((path) => loadContent(path));
  const contentData = await Promise.all(contentPromises);

  return contentData.reduce((acc, data, index) => ({
    ...acc,
    [pages[index]]: data,
  }), {});
}

(async function () {
  try {
    const initialContent =
      process.env.NODE_ENV !== 'production' ? await fetchAllContent() : window.CONTENT;

    const container = document.getElementById('app');
    const root = createRoot(container);
    root.render(<App initialContent={initialContent} />);
  } catch (error) {
    console.error(error);
  }
})();
