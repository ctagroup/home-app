import './rolePermissionManager.html';
import HomeRoles from '/imports/config/roles.js';
import RolePermissions from '/imports/api/rolePermissions/rolePermissions';
// import HomePermissions from '/imports/config/permissions.js';

const PermissionsList = [
  'viewAdminRoutes',
  'editClientData',
];

Template.rolePermissionManager.helpers({
  getRoles() {
    return HomeRoles;
  },
});

Template.roleManagerRoleItem.helpers({
  getRolePermissions(role) {
    const rolePermissionsCursor = RolePermissions.find({ roleName: role });
    return rolePermissionsCursor;
  },
  getAvailablePermissions(role) {
    const rolePermissions = RolePermissions.find({ roleName: role }).fetch();
    return _.difference(PermissionsList,
      _.map(rolePermissions, (permissionData) => permissionData.permissionName));
  },
  availablePermissionsExist(role) {
    const rolePermissions = RolePermissions.find({ roleName: role }).fetch();
    const availablePermissions = _.difference(PermissionsList,
      _.map(rolePermissions, (permissionData) => permissionData.permissionName));
    return availablePermissions.length > 0;
  },
});
Template.roleManagerRoleItem.onCreated(function permissionManagerOnCreated() {
  this.state = new ReactiveDict();
  this.state.set('selectedPermission', '');
});

Template.roleManagerRoleItem.events({
  'change .permissions-list'(e) {
    console.log('Changed', e.currentTarget.value, e);
    Template.instance().state.set('selectedPermission', e.currentTarget.value);
  },
  'click .add-permission'(e) {
    e.preventDefault();
    const instance = Template.instance();
    const role = this.role;
    let permission = instance.state.get('selectedPermission');
    if (permission === '') {
      // TODO [VK]: move to onRendered ?
      const rolePermissions = RolePermissions.find({ roleName: role }).fetch();
      const availablePermissions = _.difference(PermissionsList,
        _.map(rolePermissions, (permissionData) => permissionData.permissionName));
      permission = availablePermissions[0];
    }
    Meteor.call('roles.addPermission', role, permission);
  },
});

Template.rolePermissionItem.events({
  'click .remove-permission'(e) {
    e.preventDefault();
    Meteor.call('roles.removePermission', this.role, this.permission.permissionName);
  },
});
