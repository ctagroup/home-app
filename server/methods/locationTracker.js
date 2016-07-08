/**
 * Created by udit on 08/07/16.
 */

Meteor.methods(
  {
    addUserLocation(userID, timestamp, position) {
      logger.info(userID);
      logger.info(timestamp);
      logger.info(position);

      const user = Meteor.users.findOne({ _id: userID });

      if (user) {
        const locationHistory = user.locationHistory;

        if (locationHistory !== undefined && locationHistory.length >= 1) {
          const sorted = locationHistory.sort((a, b) => {
            if (a.timestamp < b.timestamp) {
              return 1;
            }

            if (a.timestamp > b.timestamp) {
              return - 1;
            }

            return 0;
          });

          const lastPosition = sorted[0].position;

          logger.info(JSON.stringify(lastPosition));
          logger.info(JSON.stringify(position));

          if (lastPosition.lat === position.lat && lastPosition.long === position.long) {
            // No action. no need to update. device has not moved.
          } else {
            Meteor.users.update(
              { _id: userID },
              {
                $pull: {
                  locationHistory: {
                    timestamp: {
                      $lt: new Date(new Date().getTime() - (24 * 60 * 60 * 1000)),
                    },
                  },
                },
              }
            );

            return Meteor.users.update(
              { _id: userID },
              {
                $push: {
                  locationHistory: { timestamp, position },
                },
              }
            );
          }
        } else {
          return Meteor.users.update(
            { _id: userID },
            {
              $push: {
                locationHistory: { timestamp, position },
              },
            }
          );
        }
      }
      return 'No action taken';
    },
  }
);
