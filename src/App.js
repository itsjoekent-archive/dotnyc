import React, { Fragment, useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import Navigation from './components/Navigation';
import ContentContext, { useContentStore } from './utils/ContentContext';
import loadContent from './utils/loadContent';

const Content = React.lazy(() => import('./pages/Content'));
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

  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
  }, [location]);

  return (
    <Fragment>
      <Navigation />
      <main>
        <ContentContext.Provider value={activeContent}>
          <React.Suspense>
            <Switch>
              <Route path="/" component={Homepage} />
              <Route path="/bio" component={Content} />
              <Route path="/work/:slug" component={Content} />
            </Switch>
          </React.Suspense>
        </ContentContext.Provider>
      </main>
    </Fragment>
  );
}
