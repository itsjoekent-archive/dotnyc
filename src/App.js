import React, { useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import ContentContext, { useContentStore } from './utils/ContentContext';
import loadContent from './utils/loadContent';

const Homepage = React.lazy(() => import('./pages/Homepage'));
const Work = React.lazy(() => import('./pages/Work'));

const _404 = '404';

export function App(props) {
  const { initialContent } = props;
  const { contentState, setContent } = useContentStore(initialContent);
  const [location] = useLocation();

  const activeContent = contentState[location];

  useEffect(() => {
    let cancel = false;

    async function fetch() {
      try {
        const content = await loadContent(location);

        if (!cancel) {
          if (!content || Object.keys(content).length === 0) {
            setContent({ path: location, content: _404 });
          } else {
            setContent({ path: location, content });
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (!activeContent) {
      fetch();
    }

    return () => cancel = true;
  }, [
    activeContent,
    location,
    setContent,
  ]);

  return (
    <main>
      <ContentContext.Provider value={activeContent}>
        <React.Suspense>
          <Switch>
            <Route path="/" component={Homepage} />
            <Route path="/work/:slug" component={Work} />
          </Switch>
        </React.Suspense>
      </ContentContext.Provider>
    </main>
  );
}
