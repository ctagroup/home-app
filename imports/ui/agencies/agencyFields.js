import Users from '/imports/api/users/users';
import { fullName } from '/imports/api/utils';
import './agencyFields.html';

Template.agencyFields.helpers({
  allUsers() {
    return Users.find().fetch().map(user => ({
      ...user,
      fullName: user.services && user.services.HMIS && fullName(user.services.HMIS) || user._id,
    }));
  },
  usersOptions() {
    return Users.find().fetch().map(user => ({
      value: user._id,
      label: fullName(user),
    }));
  },
  memberRoleOptions() {
    return [
      {
        value: '',
        label: 'Not a member',
      },
      {
        value: 'role1',
        label: 'Role 1',
      },
      {
        value: 'role2',
        label: 'Role 2',
      },
    ];
  },
});

export function doc2form(doc) {
  const members = Users.find().fetch().map(user => ({
    role: undefined,
    userId: user._id,
  }));
  return {
    ...doc,
    members,
  };
}

export function form2doc(doc) {
  console.log('form2doc', doc);
  return doc;
}
