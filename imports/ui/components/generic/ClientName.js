import React from 'react';
import PropTypes from 'prop-types';
import { fullName } from '/imports/api/utils';


export const ClientName = ({ client }) => {
  const { dedupClientId } = client;
  const name = fullName(client).trim() || dedupClientId;
  return <span>{name}</span>;
};

ClientName.propTypes = {
  client: PropTypes.shape({
    clientId: PropTypes.string, // FIXME - dedup client id should be enough
    schema: PropTypes.string,
  }),
};
