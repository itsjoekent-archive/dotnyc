import React from 'react';

export const defaultContext = {};

const ContentContext = React.createContext(defaultContext);

export function useContent() {
  const content = React.useContent(ContentContext);
  return content;
}

export function useContentStore(initialContent) {
  const [state, dispatch] = React.useReducer((state, action) => {
    const { path, content } = action;
    return { ...state, [path]: content || {} };
  }, initialContent);

  return { setContent: dispatch, contentState: state };
}

export default ContentContext;