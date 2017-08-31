/**
 * Created by udit on 26/07/16.
 */
import { logger } from '/imports/utils/logger';
import Users from '/imports/api/users/users';
import { HmisClient } from '/imports/api/hmis-api';

Meteor.methods({
  'users.create'() {
  },

  'users.update'(userId, doc) {
    const roles = doc.roles[Roles.GLOBAL_GROUP];
    logger.info(`Setting roles of user ${userId} to`, roles);
    Roles.setUserRoles(userId, roles, Roles.GLOBAL_GROUP);

    Users.update(userId, { $set: {
      'services.HMIS.firstName': doc.services.HMIS.firstName,
      'services.HMIS.middleName': doc.services.HMIS.middleName,
      'services.HMIS.lastName': doc.services.HMIS.lastName,
      'services.HMIS.gender': doc.services.HMIS.gender,
      'services.HMIS.emailAddress': doc.services.HMIS.emailAddress,
    } });

    const hmisId = Users.findOne(userId).services.HMIS.accountId;
    const api = HmisClient.create(this.userId).api('user-service');

    api.updateUser(hmisId, {
      firstName: doc.services.HMIS.firstName,
      middleName: doc.services.HMIS.middleName,
      lastName: doc.services.HMIS.lastName,
      gender: doc.services.HMIS.gender,
      emailAddress: doc.services.HMIS.emailAddress,
    });

    // TODO: update HMIS user roles?
    // api.updateUserRoles(hmisId, doc.services.HMIS.roles);

    // TODO: update linked projects
    // TODO: change HMIS password
  },

  'users.getHmisRoles'() {
    return this.userId && HmisClient.create(this.userId).api('user-service').getRoles();
  },


/*
    createHMISUser(userObj) {
      const user = HMISAPI.createUser(userObj);

      if (user) {
        const _id = Users.insert(
          {
            createdAt: new Date(),
            services: {
              HMIS: {
                accountId: user.account.accountId,
                id: user.account.accountId,
                emailAddress: userObj.emailAddress,
                email: userObj.emailAddress,
                firstName: userObj.firstName,
                lastName: userObj.lastName,
              },
            },
            emails: [
              {
                address: userObj.emailAddress,
                verified: false,
              },
            ],
          }
        );
        logger.info(_id);
      }

      return user;
    },
    changeHMISPassword(currentPassword, newPassword, confirmNewPassword) {
      try {
        return HMISAPI.changePassword(currentPassword, newPassword, confirmNewPassword);
      } catch (err) {
        throw new Meteor.Error(err.error);
      }
    },
    updateLinkedProjects(userId, projectsLinked) {
      const _id = Users.update(userId, {
        $set: {
          projectsLinked,
        },
      });
      return _id;
    },
    updateHMISUserRoles(userId, oldRoles, newRoles) {
      const oldRoleIds = oldRoles.map(item => item.id);

      const newRoleIds = newRoles.map(item => item.id);

      const intersection = oldRoleIds.filter(item => newRoleIds.indexOf(item) !== -1);

      const localUser = Users.findOne({ _id: userId });

      HMISAPI.updateUserRoles(localUser.services.HMIS.accountId, newRoles);

      for (let i = 0; i < oldRoles.length; i += 1) {
        if (intersection.indexOf(oldRoles[i].id) === -1) {
          HMISAPI.deleteUserRole(localUser.services.HMIS.accountId, oldRoles[i].id);
        }
      }
    },
    adminNewUser(doc) {
      let emails = [];
      if (Roles.userIsInRole(this.userId, ['create_user'])) {
        emails = doc.email.split(',');
        _.each(emails, (email) => {
          const user = {};
          user.email = email;
          if (!doc.chooseOwnPassword) {
            user.password = doc.password;
          }
          const _id = Accounts.createUser(user);
          if (doc.sendPassword && (HomeConfig.fromEmail != null)) {
            Email.send({
              to: user.email,
              from: HomeConfig.fromEmail,
              subject: 'Your account has been created',
              html: `You've just had an account
              created for ${Meteor.absoluteUrl()} with password ${doc.password}`,
            });
          }
          if (!doc.sendPassword) {
            Accounts.sendEnrollmentEmail(_id);
          }
        });
      }
    },
    adminUpdateUser(modifier, _id) {
      let result = false;
      if (Roles.userIsInRole(this.userId, ['edit_user'])) {
        this.unblock();
        logger.info(modifier);
        result = Meteor.users.update({ _id }, modifier);
      }
      return result;
    },
    adminSendResetPasswordEmail(doc) {
      if (Roles.userIsInRole(this.userId, ['reset_user_password'])) {
        logger.info(`Changing password for user ${doc._id}`);
        return Accounts.sendResetPasswordEmail(doc._id);
      }
      return false;
    },
    adminChangePassword(doc) {
      if (Roles.userIsInRole(this.userId, ['reset_user_password'])) {
        logger.info(`Changing password for user ${doc._id}`);
        Accounts.setPassword(doc._id, doc.password);
        return {
          label: 'Email user their new password',
        };
      }
      return false;
    },
*/
});
