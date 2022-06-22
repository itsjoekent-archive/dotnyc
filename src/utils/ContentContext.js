import React from 'react';

export const defaultContext = {};

const ContentContext = React.createContext(defaultContext);

export function useContent() {
  const content = React.useContext(ContentContext);
  return content;
}

export function useContentStore(initialContent) {
  const [state, dispatch] = React.useReducer((state, action) => {
    const { path, content } = action;
    const finalPath = path.replaceAll('/index', '/');

    return { ...state, [finalPath]: content || {} };
  }, initialContent);

  return { setContent: dispatch, contentState: state };
}

export default ContentContext;