import { ReactiveDict } from 'meteor/reactive-dict';
import './userRoleManager.html';
// import { fullName } from '/imports/api/utils';
import HomeRoles from '/imports/config/roles.js';
import { userName, userEmails } from '/imports/api/users/helpers';

Template.userRoleManager.onCreated(function userRoleManagerOnCreated() {
  // publish roles for admins
  this.subscribe('users.all');
});

Template.userRoleManager.helpers({
  getUsers() {
    return Meteor.users.find();
  },
});

Template.roleManagerUserItem.helpers({
  getUserName(user) {
    return userName(user);
  },
  getUserRoles(user) {
    // console.log('getuserHMISRoles', user.services.HMIS.roles);
    return (user.roles && user.roles.__global_roles__) || []; //eslint-disable-line
  },
  getAvailableRoles(user) {
    const userRoles = (user.roles && user.roles.__global_roles__) || []; //eslint-disable-line
    return _.difference(HomeRoles, userRoles);
  },
  availableRolesExist(user) {
    const userRoles = (user.roles && user.roles.__global_roles__) || []; //eslint-disable-line
    return _.difference(HomeRoles, userRoles).length > 0;
  },
  getUserEmail(user) {
    const emails = userEmails(user);
    return (emails && emails[0]) || '';
  },
});

Template.roleManagerUserItem.onCreated(function userRoleManagerOnCreated() {
  this.state = new ReactiveDict();
  this.state.set('selectedRole', '');
});

Template.roleManagerUserItem.events({
  'change .roles-list'(e) {
    console.log('Changed', e.currentTarget.value, e);
    Template.instance().state.set('selectedRole', e.currentTarget.value);
  },
  'click .add-role'(e) {
    e.preventDefault();
    const instance = Template.instance();
    const user = this.user;
    let role = instance.state.get('selectedRole');
    if (role === '') {
      // TODO [VK]: move to onRendered ?
      const userRoles = (user.roles && user.roles.__global_roles__) || []; //eslint-disable-line
      const availableRoles = _.difference(HomeRoles, userRoles);
      role = availableRoles[0];
    }
    Meteor.call('users.addRole', this.user._id, role);
  },
});

Template.userRoleItem.events({
  'click .remove-role'(e) {
    e.preventDefault();
    Meteor.call('users.removeRole', this.user._id, this.role);
  },
});
