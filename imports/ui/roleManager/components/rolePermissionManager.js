import './rolePermissionManager.html';
import HomeRoles from '/imports/config/roles.js';
import HomePermissions from '/imports/config/permissions.js';

Template.rolePermissionManager.helpers({
  getRoles() {
    return HomeRoles;
  },
  getHomeRoles() {
    return [
      { title: 'Manager' },
      { title: 'User' },
      { title: 'Admin' },
    ];
  },
  getAvailablePermissions(role) {
    console.log(role);
    const Roles = { findOne() { return 'collection'; } };
    const roleData = Roles.findOne({ name: role });
    const rolePermissions = (roleData && roleData.permissions) || [];
    return _.difference(HomePermissions, rolePermissions);
  },
  getPermissions() {
    return [
      { name: 'fake permission1' },
      { name: 'fake permission2' },
    ];
  },
  isPermissionInRole() {
    return Math.floor(Math.random() * 2) === 0 ? 'checked' : '';
  },
});
