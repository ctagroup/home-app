/**
 * Created by udit on 26/07/16.
 */

Meteor.methods(
  {
    createHMISUser(userObj) {
      const user = HMISAPI.createUser(userObj);

      if (user) {
        const _id = users.insert(
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
    updateHMISUser(userId, userObj) {
      const localUser = users.findOne({ _id: userId });

      const user = HMISAPI.updateUser(localUser.services.HMIS.accountId, userObj);

      if (user) {
        const _id = users.update(userId, {
          $set: {
            'services.HMIS.firstName': userObj.firstName,
            'services.HMIS.lastName': userObj.lastName,
          },
        });
        logger.info(_id);
      }

      return user;
    },
    updateHMISUserRoles(userId, oldRoles, newRoles) {

      const oldRoleIds = oldRoles.map((item) => {
        return item.id;
      });

      const newRoleIds = newRoles.map((item) => {
        return item.id;
      });

      const intersection = oldRoleIds.filter((item) => {
        return newRoleIds.indexOf(item) != -1;
      });

      const localUser = users.findOne({ _id: userId });

      HMISAPI.updateUserRoles(localUser.services.HMIS.accountId, newRoles);

      for (let i = 0; i < oldRoles.length; i++) {
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
              /* eslint-disable */
              html: `You've just had an account created for ${Meteor.absoluteUrl()} with password ${doc.password}`,
              /* eslint-enable */
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
  }
);
