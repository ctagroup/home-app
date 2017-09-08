/**
 * Created by udit on 14/12/15.
 */
if (typeof Accounts.onCreateUser !== 'undefined') {
  Accounts.onCreateUser(
    (options, user) => {
      const userz = user;

      if (userz.services) {
        const service = _.keys(userz.services)[0];
        let email;
        switch (service) {
          case 'password':
            email = (userz.emails !== undefined) ? userz.emails.address : '';
            break;
          default:
            email = userz.services[service].email;
            break;
        }

        if (!email) {
          return userz;
        }

        // see if any existing user has this email address, otherwise create new
        const existingUser = Meteor.users.findOne({ 'emails.address': email });

        if (!existingUser) {
          if (!userz.emails) {
            userz.emails = [
              {
                address: email,
                verified: true,
              },
            ];
          }
          return userz;
        }

        // precaution, these will exist from accounts-password if used
        if (!existingUser.services) {
          existingUser.services = {
            resume: {
              loginTokens: [],
            },
          };
        }
        if (!existingUser.services.resume) {
          existingUser.services.resume = { loginTokens: [] };
        }

        if (!existingUser.emails) {
          existingUser.emails = [
            {
              address: email,
              verified: true,
            },
          ];
        }

        // copy accross new service info
        existingUser.services[service] = userz.services[service];
        if (userz.services.resume
            && userz.services.resume.loginTokens && userz.services.resume.loginTokens[0]) {
          existingUser.services.resume.loginTokens.push(userz.services.resume.loginTokens[0]);
        }

        // even worse hackery
        Meteor.users.remove({ _id: existingUser._id }); // remove existing record
        return existingUser;                          // record is re-inserted
      }

      return userz;
    }
  );
}
