import React from 'react';
import PropTypes from 'prop-types';


export const ErrorLabel = ({ text, hint }) => (
  <span className="label label-danger" title={hint}>
    {text}
  </span>
);

ErrorLabel.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  hint: PropTypes.string,
};
