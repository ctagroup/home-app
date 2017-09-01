import './hmisProfile.js';
import './usersCreateView.html';

Template.usersCreateView.events(
  {
    'submit #create-user': (evt, tmpl) => {
      evt.preventDefault();
      // TODO: create new users
      console.log(tmpl);
      /*

      $(tmpl.find('.errors')).html('');

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

      const errors = [];
      if (password.length < 8 || password.length > 16) {
        errors.push('Password length should be between 8 & 16.');
      }

      if (password.search(/[a-z]/) < 0) {
        errors.push('Password should contain at least one lowercase character.');
      }

      if (password.search(/[A-Z]/) < 0) {
        errors.push('Password should contain at least one uppercase character.');
      }

      if (password.search(/[0-9]/) < 0) {
        errors.push('Password should contain at least one number.');
      }

      if (password.search(/[!@#$*"]/) < 0) {
        errors.push('Password should contain at least one special character from [! @ # $ * "].');
      }

      if (errors.length > 0) {
        const separator = '</p><p class="alert alert-danger">';
        const errorsHtml = `<p class="alert alert-danger">${errors.join(separator)}</p>`;
        $(tmpl.find('.errors')).html(errorsHtml);
      } else {
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

            if (!result) {
              const message = 'User could not be created. There was an error in HMIS system.';
              const errorsHtml = `<p class="alert alert-danger">${message}</p>`;
              $(tmpl.find('.errors')).html(errorsHtml);
            } else {
              Router.go('/users');
            }
          }
        });
      }
      */
    },
  }
);
