import React from 'react';
import PropTypes from 'prop-types';
import { fullName } from '/imports/api/utils';


export const ClientName = ({ client }) => {
  const { clientId } = client;
  const name = fullName(client) || clientId;
  return <span>{name}</span>;
};

ClientName.propTypes = {
  client: PropTypes.shape({
    clientId: PropTypes.string,
    schema: PropTypes.string,
  }),
};
