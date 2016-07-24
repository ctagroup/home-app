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
