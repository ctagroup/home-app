import React from 'react';
import PropTypes from 'prop-types';
import { fullName } from '/imports/api/utils';


export const ErrorPropType = PropTypes.shape({
  message: PropTypes.string,
  statusCode: PropTypes.number,
});

export const Cell = ({ text, href, error }) => {
  if (error) {
    return (
      <span>
        {text}
        {' '}
        <span className="label label-danger" title={error.message}>
          {error.statusCode}
        </span>
      </span>
    );
  }

  if (href) {
    return <a href={href}>{text}</a>;
  }
  return <span>{text}</span>;
};

Cell.propTypes = {
  text: PropTypes.string,
  href: PropTypes.string,
  error: ErrorPropType,
};


export const ClientCell = ({ client, href }) => {
  const { clientId, error } = client;
  const name = fullName(client) || clientId;
  return <Cell text={name} href={href} error={error} />;
};

ClientCell.propTypes = {
  client: PropTypes.shape({
    clientId: PropTypes.string,
    schema: PropTypes.string,
    error: ErrorPropType,
  }),
  href: PropTypes.string,
};
