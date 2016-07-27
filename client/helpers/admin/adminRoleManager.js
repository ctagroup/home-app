Template.AdminRoleManager.helpers(
  {
    getHomeRoles() {
      return homeRoles.find({}).fetch();
    },
    getPermissions() {
      let permissions = Roles.getAllRoles().fetch();
      let roles = homeRoles.find({}).fetch();
      roles = $.map(
        roles, (role) => role.title
      );
      permissions = $.grep(
        permissions, (p) => $.inArray(p.name, roles) < 0
      );
      return permissions;
    },
    isPermissionInRole(permission) {
      const rolePermissionsCollection = HomeUtils.adminCollectionObject('rolePermissions');
      const result = rolePermissionsCollection.find(
        { role: this.title, permission, value: true }
      ).fetch();
      if (result.length > 0) {
        return 'checked';
      }
      return '';
    },
  }
);
