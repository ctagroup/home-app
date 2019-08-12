import { check, Match } from 'meteor/check';
import { logger } from '/imports/utils/logger';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import Users, { ChangePasswordSchema, UserCreateFormSchema } from '/imports/api/users/users';
import Agencies from '/imports/api/agencies/agencies';
import { HmisClient } from '/imports/api/hmisApi';
import HomeApiClient from '/imports/api/homeApi/homeApiClient';
import { ensureRolesFormat } from './helpers';

Meteor.methods({
  'users.create'(insertDoc) {
    logger.info(`METHOD[${this.userId}]: users.create`, insertDoc);
    check(insertDoc, UserCreateFormSchema);
    if (!Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

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
    logger.info(`METHOD[${this.userId}]: users.update`, userId, doc);
    check(userId, String);
    // TODO: doc should be validated by SimpleSchema
    if (!Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    const roles = (doc.roles && doc.roles[Roles.GLOBAL_GROUP]) || [];
    logger.info(`Setting roles of user ${userId} to`, roles);
    Roles.setUserRoles(userId, roles, Roles.GLOBAL_GROUP);
    Users.update(userId, { $set: {
      'services.HMIS.firstName': doc.HMIS.firstName,
      'services.HMIS.middleName': doc.HMIS.middleName,
      'services.HMIS.lastName': doc.HMIS.lastName,
      'services.HMIS.gender': doc.HMIS.gender,
      'services.HMIS.emailAddress': doc.HMIS.emailAddress,
    } });

    Users.update(userId, { $set: {
      projectsLinked: doc.projectsLinked || [],
    } });

    const currentHMISData = Users.findOne(userId).services.HMIS;
    const hmisId = currentHMISData.accountId;
    const api = HmisClient.create(this.userId).api('user-service');

    api.updateUser(hmisId, {
      firstName: doc.HMIS.firstName,
      middleName: doc.HMIS.middleName,
      lastName: doc.HMIS.lastName,
      gender: doc.HMIS.gender,
      emailAddress: doc.HMIS.emailAddress,
    });

    const newRoles = ensureRolesFormat(doc.HMIS.roles);
    const oldRoles = ensureRolesFormat(currentHMISData.roles);
    const oldRoleIds = oldRoles.map(item => item.id);
    const newRoleIds = newRoles.map(item => item.id);
    api.updateUserRoles(hmisId, newRoles);

    const removedRoleIds = oldRoleIds.filter(e => !newRoleIds.includes(e));
    removedRoleIds.map(roleId => api.deleteUserRole(hmisId, roleId));

    // TODO: change HMIS password
  },

  'users.delete'(userId) {
    logger.info(`METHOD[${this.userId}]: users.delete`, userId);
    check(userId, String);
    if (!Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    const user = Users.findOne(userId);
    const hmisId = user.services && user.services.HMIS && user.services.HMIS.accountId;
    if (hmisId) {
      HmisClient.create(this.userId).api('user-service').deleteUser(hmisId);
    }
    Users.remove(userId);
  },

  'users.changeOwnPassword'(passwordChange) {
    logger.info(`METHOD[${this.userId}]: users.changeOwnPassword`);
    check(passwordChange, ChangePasswordSchema);
    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized');
    }

    const { currentPassword, newPassword, confirmNewPassword } = passwordChange;
    const api = HmisClient.create(this.userId).api('user-service');
    const result = api.changeOwnPassword(currentPassword, newPassword, confirmNewPassword);
    return result;
  },

  'users.hmisRoles'() {
    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized');
    }
    return HmisClient.create(this.userId).api('user-service').getRoles();
  },

  'users.projects.all'() {
    if (!this.userId) {
      throw new Meteor.Error(401, 'Unauthorized');
    }
    const projects = HmisClient.create(this.userId).api('client').getProjects();
    return projects.map(p => ({
      projectId: p.projectId,
      projectName: p.projectName,
    }));
  },

  'users.projects.setActive'(projectId) {
    logger.info(`METHOD[${this.userId}]: users.projects.setActive`, projectId);
    Match.test(projectId, Match.OneOf(String, null)); // eslint-disable-line
    if (!this.userId) {
      throw new Meteor.Error(401, 'Unauthorized');
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
      throw new Meteor.Error(403, 'Forbidden');
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
      accessToken,
      refreshToken,
      expiresAt: new Date(expiresAt),
      expiresIn: ((expiresAt - new Date()) / 1000).toFixed(2),
      apiResponse,
    };
    logger.info('user data', result);
    return {
      ...result,
      accessToken: accessToken.substr(0, 8),
      refreshToken: refreshToken.substr(0, 8),
    };
  },
});
