import { check, Match } from 'meteor/check';

import { logger } from '/imports/utils/logger';
import Users, { ChangePasswordSchema, UserCreateFormSchema } from '/imports/api/users/users';
import Agencies from '/imports/api/agencies/agencies';
import { HmisClient } from '/imports/api/hmisApi';

Meteor.methods({
  'users.create'(insertDoc) {
    logger.info(`METHOD[${Meteor.userId()}]: users.create`, insertDoc);
    check(insertDoc, UserCreateFormSchema);
    // TODO: check permissions

    try {
      const hc = HmisClient.create(this.userId);
      const account = hc.api('user-service').createUser({
        username: insertDoc.email,
        emailAddress: insertDoc.email,
        password: insertDoc.password,
        confirmPassword: insertDoc.passwordConfirm,
        firstName: insertDoc.firstName || '',
        middleName: insertDoc.middleName || '',
        lastName: insertDoc.lastName || '',
        gender: insertDoc.gender,
      });

      const userId = Users.insert(
        {
          _id: account.accountId,
          createdAt: new Date(),
          services: {
            HMIS: {
              accountId: account.accountId,
              id: account.accountId,
              emailAddress: account.emailAddress,
              firstName: account.firstName,
              middleName: account.middleName,
              lastName: account.lastName,
            },
          },
          emails: [
            {
              address: account.emailAddress,
              verified: false,
            },
          ],
        }
      );
      Roles.setUserRoles(userId, insertDoc.roles || [], Roles.GLOBAL_GROUP);
      return userId;
    } catch (e) {
      throw new Meteor.Error(e.details.code, e.reason);
    }
  },

  'users.update'(userId, doc) {
    logger.info(`METHOD[${Meteor.userId()}]: users.update`, userId, doc);

    // TODO: doc should be validated by SimpleSchema
    const roles = (doc.roles && doc.roles[Roles.GLOBAL_GROUP]) || [];
    logger.info(`Setting roles of user ${userId} to`, roles);
    Roles.setUserRoles(userId, roles, Roles.GLOBAL_GROUP);

    Users.update(userId, { $set: {
      'services.HMIS.firstName': doc.services.HMIS.firstName,
      'services.HMIS.middleName': doc.services.HMIS.middleName,
      'services.HMIS.lastName': doc.services.HMIS.lastName,
      'services.HMIS.gender': doc.services.HMIS.gender,
      'services.HMIS.emailAddress': doc.services.HMIS.emailAddress,
    } });

    // TODO: permissions, only admin can do it
    Users.update(userId, { $set: {
      projectsLinked: doc.projectsLinked || [],
    } });

    const currentHMISData = Users.findOne(userId).services.HMIS;
    const hmisId = currentHMISData.accountId;
    const api = HmisClient.create(this.userId).api('user-service');

    api.updateUser(hmisId, {
      firstName: doc.services.HMIS.firstName,
      middleName: doc.services.HMIS.middleName,
      lastName: doc.services.HMIS.lastName,
      gender: doc.services.HMIS.gender,
      emailAddress: doc.services.HMIS.emailAddress,
    });

    const newRoles = doc.services.HMIS.roles;
    const oldRoles = currentHMISData.roles;
    const oldRoleIds = oldRoles.map(item => item.id);
    const newRoleIds = newRoles.map(item => item.id);
    api.updateUserRoles(hmisId, newRoles);

    const removedRoleIds = oldRoleIds.filter(e => !newRoleIds.includes(e));
    removedRoleIds.map(roleId => api.deleteUserRole(hmisId, roleId));

    // TODO: change HMIS password
  },
  'users.delete'(userId) {
    logger.info(`METHOD[${Meteor.userId()}]: users.delete`, userId);
    check(userId, String);
    // TODO: permissions
    const user = Users.findOne(userId);
    const hmisId = user.services && user.services.HMIS && user.services.HMIS.accountId;
    if (hmisId) {
      HmisClient.create(this.userId).api('user-service').deleteUser(hmisId);
    }
    Users.remove(userId);
  },
  'users.changeOwnPassword'(passwordChange) {
    check(passwordChange, ChangePasswordSchema);
    const { currentPassword, newPassword, confirmNewPassword } = passwordChange;
    const api = HmisClient.create(this.userId).api('user-service');
    const result = api.changeOwnPassword(currentPassword, newPassword, confirmNewPassword);
    return result;
  },
  'users.hmisRoles'() {
    // TODO: permissions
    return this.userId && HmisClient.create(this.userId).api('user-service').getRoles();
  },
  'users.projects.all'() {
    if (!this.userId) {
      throw new Meteor.Error('403', 'Forbidden');
    }
    const projects = HmisClient.create(this.userId).api('client').getProjects();
    return projects.map(p => ({
      projectId: p.projectId,
      projectName: p.projectName,
    }));
  },
  'users.projects.setActive'(projectId) {
    logger.info(`METHOD[${Meteor.userId()}]: users.projects.setActive`, projectId);
    Match.test(projectId, Match.OneOf(String, null)); // eslint-disable-line
    if (!this.userId) {
      throw new Meteor.Error('403', 'Forbidden');
    }

    const query = {
      projectsMembers: {
        $elemMatch: {
          userId: this.userId,
          projectId,
        },
      },
    };
    if (projectId && Agencies.find(query).count() === 0) {
      throw new Meteor.Error(403, 'Not authorized');
    }

    Users.update(this.userId, { $set: {
      activeProjectId: projectId,
    } });
  },

  'users.checkToken'() {
    logger.info(`METHOD[${this.userId}]: users.checkToken`);
    const user = Meteor.users.findOne(this.userId);
    const { accessToken, refreshToken, expiresAt } = user.services.HMIS;

    let apiResponse = false;
    try {
      const hc = HmisClient.create(this.userId);
      apiResponse = hc.api('user-service').getUser(this.userId);
    } catch (err) {
      apiResponse = err;
    }

    const result = {
      accessToken: accessToken.substr(0, 8),
      refreshToken: refreshToken.substr(0, 8),
      expiresAt: new Date(expiresAt),
      expiresIn: ((expiresAt - new Date()) / 1000).toFixed(2),
      apiResponse,
    };
    logger.info(result);
    return result;
  },

  addUserLocation(userID, timestamp, position) {
    // TODO: unused code
    logger.info(userID);
    logger.info(timestamp);
    logger.info(position);

    const user = Meteor.users.findOne({ _id: userID });

    if (user) {
      const locationHistory = user.locationHistory;

      if (locationHistory !== undefined && locationHistory.length >= 1) {
        const sorted = locationHistory.sort((a, b) => {
          if (a.timestamp < b.timestamp) {
            return 1;
          }

          if (a.timestamp > b.timestamp) {
            return -1;
          }

          return 0;
        });

        const lastPosition = sorted[0].position;

        logger.info(JSON.stringify(lastPosition));
        logger.info(JSON.stringify(position));

        if (lastPosition.lat === position.lat && lastPosition.long === position.long) {
          // No action. no need to update. device has not moved.
        } else {
          Meteor.users.update(
            { _id: userID },
            {
              $pull: {
                locationHistory: {
                  timestamp: {
                    $lt: new Date(new Date().getTime() - (24 * 60 * 60 * 1000)),
                  },
                },
              },
            }
          );

          return Meteor.users.update(
            { _id: userID },
            {
              $push: {
                locationHistory: { timestamp, position },
              },
            }
          );
        }
      } else {
        return Meteor.users.update(
          { _id: userID },
          {
            $push: {
              locationHistory: { timestamp, position },
            },
          }
        );
      }
    }
    return 'No action taken';
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
