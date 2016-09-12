/**
 * Created by udit on 26/07/16.
 */

Meteor.methods(
  {
    adminInsertDoc(doc, collection) {
      return HomeUtils.adminCollectionObject(collection).insert(doc);
    },
    adminUpdateDoc(modifier, collection, _id) {
      return HomeUtils.adminCollectionObject(collection).update({ _id }, modifier);
    },
    adminRemoveDoc(collection, _id) {
      return HomeUtils.adminCollectionObject(collection).remove({ _id });
    },
    checkDevUser() {
      let adminEmails = [];
      const user = Meteor.users.findOne({ _id: this.userId });
      const developerPermissions = HomeConfig.defaultRolePermissions.Developer;
      if (this.userId && !Roles.userIsInRole(this.userId, developerPermissions)
          && user.emails && (user.emails.length > 0)) {
        const email = user.emails[0].address.toLowerCase();
        if (typeof Meteor.settings.adminEmails !== 'undefined') {
          adminEmails = Meteor.settings.adminEmails;
          if (adminEmails.indexOf(email) > -1) {
            logger.info(`Adding dev user: ${email}`);
            return Roles.addUsersToRoles(this.userId, developerPermissions, Roles.GLOBAL_GROUP);
          }
        } else if (typeof HomeConfig !== 'undefined'
           && typeof HomeConfig.adminEmails === 'object') {
          adminEmails = HomeConfig.adminEmails;
          if (adminEmails.indexOf(email) > -1) {
            logger.info(`Adding dev user: ${email}`);
            return Roles.addUsersToRoles(this.userId, developerPermissions, Roles.GLOBAL_GROUP);
          }
        } else if (this.userId === Meteor.users.findOne({}, {
          sort: { createdAt: 1 } })._id) {
          logger.info(`Making first user admin: ${email}`);
          return Roles.addUsersToRoles(this.userId, developerPermissions, Roles.GLOBAL_GROUP);
        }
      }
      return false;
    },
    adminSetCollectionSort(collection, _sort) {
      return global.AdminPages[collection].set({
        sort: _sort,
      });
    },
  }
);
