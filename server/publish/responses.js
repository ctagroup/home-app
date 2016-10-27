/**
 * Created by udit on 27/10/16.
 */

Meteor.publish(
  'responses', function publishResponses() {
    const self = this;

    if (self.userId && typeof responses !== 'undefined') {

      HMISAPI.setCurrentUserId(self.userId);

      const responseList = responses.find().fetch();

      for (let i = 0; i < responseList.length; i += 1) {
        responseList[i].clientDetails = HMISAPI.getClient(
          responseList[i].clientID,
          responseList[i].clientSchema,
          // useCurrentUserObject
          false
        );
        self.added('responses', responseList[i]._id, responseList[i]);
      }
    }

    return self.ready();
  }
);
