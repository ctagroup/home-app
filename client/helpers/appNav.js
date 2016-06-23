/**
 * Created by udit on 12/12/15.
 */

Template.appNav.helpers(
  {
    currentUserGravatar() {
      const user = Meteor.user();
      const email = user && user.emails && user.emails[0].address;
      // email = Email.normalize( email );
      return `<img class="avatar small" src="${Gravatar.imageUrl(email)}" />`;
    },
    currentUserFullName() {
      const user = Meteor.user();

      if (user && user.services && user.services.HMIS && user.services.HMIS.name) {
        return user.services.HMIS.name.trim();
      }

      if (user && user.services && user.services.HMIS
          && user.services.HMIS.firstName && user.services.HMIS.lastName) {
        return (
          `${user.services.HMIS.firstName.trim()} ${user.services.HMIS.lastName.trim()}`
        ).trim();
      }

      if (user && user.emails && user.emails[0].address) {
        return user.emails[0].address;
      }

      return '';
    },
  }
);
