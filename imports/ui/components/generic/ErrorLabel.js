import React from 'react';
import PropTypes from 'prop-types';


export const ErrorLabel = ({ text, description }) => (
  <span className="label label-danger" title={description}>
    {text}
  </span>
);

ErrorLabel.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  description: PropTypes.string,
};
