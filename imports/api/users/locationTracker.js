/**
 * Created by udit on 08/07/16.
 */

LocationTracker = {
  getLocationHistory(userID) {
    let locationHistory = [];

    const user = Meteor.users.findOne({ _id: userID });

    if (user) {
      const locationHistoryDB = user.locationHistory;

      if (locationHistoryDB && locationHistoryDB.length >= 1) {
        const sorted = locationHistoryDB.sort(
          (a, b) => {
            if (a.timestamp < b.timestamp) {
              return 1;
            }

            if (a.timestamp > b.timestamp) {
              return -1;
            }

            return 0;
          }
        );
        locationHistory = sorted;
      }
    }
    return locationHistory;
  },
  getLastPosition(userID) {
    let lastPosition = {
      lat: 0,
      long: -180,
      accuracy: 100,
    };

    const locationHistory = LocationTracker.getLocationHistory(userID);

    if (locationHistory.length >= 1) {
      lastPosition = locationHistory[0].position;
    }

    return lastPosition;
  },
};
