import Alert from '/imports/ui/alert';
import { UserCreateFormSchema } from '/imports/api/users/users';
import './userCreateForm.html';

Template.userCreateForm.helpers({
  schema() {
    return UserCreateFormSchema;
  },
});

AutoForm.addHooks('userCreateForm', {
  onSubmit: function submit(insertDoc) {
    this.event.preventDefault();
    Meteor.call('users.create', insertDoc, (err, res) => {
      this.done(err, res);
    });
    return false;
  },
  onSuccess() {
    Alert.success('User created');
  },
  onError(formType, err) {
    Alert.error(err);
  },
});
