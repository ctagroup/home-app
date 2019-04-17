import React from 'react';


export const Link = ({ route, params, query, children }) => {
  const options = {
    query,
  };
  const href = Router.path(route, params, options);
  return <a href={href}>{children}</a>;
};
