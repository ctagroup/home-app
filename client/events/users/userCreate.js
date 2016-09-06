/**
 * Created by udit on 04/09/16.
 */

Template.AdminDashboardusersNew.events(
  {
    'click .createUser': (evt, tmpl) => {
      evt.preventDefault();
      const firstName = tmpl.find('.fName').value;
      const middleName = tmpl.find('.mName').value;
      const lastName = tmpl.find('.lName').value;
      const gender = tmpl.find('.gender').value;
      const emailAddress = tmpl.find('.email').value;
      const username = emailAddress;
      const password = tmpl.find('.password').value;
      const confirmPassword = password;
      const projectGroupId = tmpl.find('.projectGroup').value;
      const userProfileId = tmpl.find('.userProfile').value;
      const projectGroup = projectGroups.findOne({ projectGroupId });
      const profile = userProfiles.findOne({ id: userProfileId });

      const userObj = {
        username,
        emailAddress,
        password,
        confirmPassword,
        firstName,
        middleName,
        lastName,
        gender,
        projectGroup,
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
