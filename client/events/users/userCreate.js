/**
 * Created by udit on 04/09/16.
 */

Template.AdminDashboardusersNew.events(
  {
    'click .createUser': (evt, tmpl) => {
      evt.preventDefault();
      const firstName = tmpl.find('.fName').value.trim();
      const middleName = tmpl.find('.mName').value.trim();
      const lastName = tmpl.find('.lName').value.trim();
      const emailAddress = tmpl.find('.email').value.toLowerCase();
      const username = emailAddress;
      const password = tmpl.find('.password').value;
      const confirmPassword = password;
      // const projectGroupId = tmpl.find('.projectGroup').value;
      const roleIds = $(tmpl.find('.role')).val();
      const userProfileId = tmpl.find('.userProfile').value;
      // const projectGroup = projectGroups.findOne({ projectGroupId });
      const roles = hmisRoles.find({ id: { $in: roleIds } }).fetch();
      const profile = userProfiles.findOne({ id: userProfileId });

      const userObj = {
        username,
        emailAddress,
        password,
        confirmPassword,
        firstName,
        middleName,
        lastName,
        // projectGroup,
        roles,
        profile,
      };

      Meteor.call('createHMISUser', userObj, (error, result) => {
        if (error) {
          logger.info(error);
        } else {
          logger.info(result);
          Router.go('/users');
        }
      });
    },
  }
);
