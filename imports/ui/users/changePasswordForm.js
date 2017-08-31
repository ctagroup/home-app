import { ChangePasswordSchema } from '/imports/api/users/users';
import './changePasswordForm.html';


Template.changePasswordForm.helpers({
  schema() {
    return ChangePasswordSchema;
  },
});

AutoForm.addHooks('changePasswordForm', {
  onSubmit: function submit(insertDoc) {
    this.event.preventDefault();
    Meteor.call('users.changeOwnPassword', insertDoc, (err, res) => {
      this.done(err, res);
    });
    return false;
  },
  onSuccess() {
    Bert.alert('Password updated', 'success', 'growl-top-right');
  },
  onError(formType, err) {
    Bert.alert(err.reason || err.error || err.message, 'danger', 'growl-top-right');
  },
});
