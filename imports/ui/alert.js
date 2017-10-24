const Alert = {
  success(message) {
    Bert.alert(message, 'success', 'growl-top-right');
  },
  error(err) {
    Bert.alert(err.reason || err.error || err.message || err, 'danger', 'growl-top-right');
  },
};

export default Alert;
