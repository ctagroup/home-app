import { trimText } from '/imports/api/utils';

Bert.defaults = {
  hideDelay: 5000,
};

const Alert = {
  success(message) {
    Bert.alert(message, 'success', 'growl-top-right');
  },
  warning(message) {
    console.warn(message);
    Bert.alert({
      message,
      type: 'warning',
      style: 'growl-top-right',
    });
  },
  error(err, extra) {
    const message = trimText(err.reason || err.error || err.message || err, 100);
    console.error(message);
    Bert.alert({
      message: extra ? `${extra} ${message}` : message,
      type: 'danger',
      style: 'growl-top-right',
    });
  },
};

export default Alert;
