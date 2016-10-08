/**
 * Created by Anush-PC on 7/19/2016.
 */

Meteor.publish(
  'housingMatch', function publishHousingMatch() {
    const self = this;

    let housingMatch = [];
    if (self.userId) {
      HMISAPI.setCurrentUserId(self.userId);
      housingMatch = HMISAPI.getHousingMatchForPublish();
      // according to the content received.
      // Adding Dummy Data for testing.
      console.log(housingMatch);
    } else {
      HMISAPI.setCurrentUserId('');
    }
    if (housingMatch) {
      logger.info(`Publishing Housing Match: ${housingMatch.length}`);
      for (let i = 0; i < housingMatch.length; i += 1) {
        // TODO Add client details (Name & link to profile) here.
        self.added('housingMatch', housingMatch[i].reservationId, housingMatch[i]);
      }
    }
    self.ready();
  }
);
