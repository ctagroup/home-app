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
        if (responseList[i].isHMISClient && responseList[i].clientSchema) {
          responseList[i].clientDetails = HMISAPI.getClient(
            responseList[i].clientID,
            responseList[i].clientSchema,
            // useCurrentUserObject
            false
          );
        } else {
          responseList[i].clientDetails = clients.findOne({ _id: responseList[i].clientID });
        }
        self.added('responses', responseList[i]._id, responseList[i]);
      }
    }

    return self.ready();
  }
);

Meteor.publish(
  'singleResponse', function publishSingleResponse(responseId) {
    const self = this;

    if (self.userId && typeof responses !== 'undefined') {
      HMISAPI.setCurrentUserId(self.userId);

      const response = responses.findOne({ _id: responseId });

      if (response && response.isHMISClient && response.clientSchema) {
        response.clientDetails = HMISAPI.getClient(
          response.clientID,
          response.clientSchema,
          // useCurrentUserObject
          false
        );
        self.added('responses', response._id, response);
      } else if (response) {
        response.clientDetails = clients.findOne({ _id: response.clientID });
        self.added('responses', response._id, response);
      }
    }

    return self.ready();
  }
);
