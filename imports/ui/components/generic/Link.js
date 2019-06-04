import React from 'react';


export const Link = ({ style, className, route, params, query, children }) => {
  const options = {
    query,
  };
  const href = Router.path(route, params, options);
  return <a style={style} className={className} href={href}>{children}</a>;
};
