/**
 * Created by udit on 08/07/16.
 */

// Tracker.autorun(() => {
  // if (Meteor.user()) {
    // const position = Geolocation.currentLocation();

    // if (position) {
      // const coords = {
      //   accuracy: position.coords.accuracy,
      //   lat: position.coords.latitude,
      //   long: position.coords.longitude,
      // };
      // Meteor.call(
      //   'addUserLocation',
      //   Meteor.user()._id,
      //   new Date(position.timestamp),
      //   coords,
      //   (error, result) => {
      //     if (error) {
      //       logger.log(error);
      //     } else {
      //       logger.log(result);
      //     }
      //   }
      // );
    // } else {
      // logger.log('position not found.');
      // logger.log(Geolocation.error());
    // }
  // }
// });

UI.registerHelper(
  'currentUserCan', (cap) => Roles.userIsInRole(Meteor.user(), cap)
);

Template.registerHelper(
  'formatDate', (date) => moment(date).format('MM/DD/YYYY')
);

Template.registerHelper(
  'my_console_log', (data) => {
    logger.log(data);
  }
);

UI.registerHelper('isiOS', () => is.ios());
UI.registerHelper('isAndroid', () => is.android());
UI.registerHelper('isCordova', () => Meteor.isCordova);

UI.registerHelper('currentUserGravatar', () => {
  const user = Meteor.user();
  const email = user && user.emails && user.emails[0].address;
  // email = Email.normalize( email );
  return `<img class="avatar small" src="${Gravatar.imageUrl(email, { secure: true })}" />`;
});

UI.registerHelper('currentUserFullName', () => {
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
});
