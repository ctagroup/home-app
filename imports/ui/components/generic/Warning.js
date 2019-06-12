import React from 'react';


export const Warning = ({ children }) => (
  <div className="text text-warning">
    <i className="fa fa-exclamation-triangle" aria-hidden="true" /> {children}
  </div>
);
