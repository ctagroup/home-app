import PropTypes from 'prop-types';


export const ErrorPropType = PropTypes.shape({
  message: PropTypes.string,
  statusCode: PropTypes.number,
});
