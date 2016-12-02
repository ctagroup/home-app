/**
 * Created by udit on 27/10/16.
 */

Meteor.publish(
  'responses', function publishResponses() {
    const self = this;
    let stopFunction = false;
    self.unblock();

    self.onStop(() => {
      stopFunction = true;
    });

    if (self.userId && typeof responses !== 'undefined') {
      HMISAPI.setCurrentUserId(self.userId);

      const responseList = responses.find().fetch();

      for (let i = 0; i < responseList.length && !stopFunction; i += 1) {
        if (responseList[i].isHMISClient && responseList[i].clientSchema) {
          responseList[i].clientDetails = HMISAPI.getClient(
            responseList[i].clientID,
            responseList[i].clientSchema,
            // useCurrentUserObject
            false
          );
        } else {
          const localClient = clients.findOne({ _id: responseList[i].clientID });

          if (localClient) {
            responseList[i].clientDetails = localClient;
          } else {
            const hmisClientSearch = HMISAPI.searchClient(
              responseList[i].clientID,
              // limit
              10,
              // useCurrentUserObject
              false
            );
            if (hmisClientSearch.length > 0) {
              responseList[i].clientDetails = hmisClientSearch[0];
              responseList[i].isHMISClient = true;
              let schema = 'v2015';
              if (responseList[i].clientDetails.link
                  && responseList[i].clientDetails.link.indexOf('v2014') !== -1) {
                schema = 'v2014';
              }
              responseList[i].clientSchema = schema;
            }
          }
        }
        self.added('responses', responseList[i]._id, responseList[i]);
        self.ready();
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
        const localClient = clients.findOne({ _id: response.clientID });
        if (localClient) {
          response.clientDetails = localClient;
        } else {
          const hmisClientSearch = HMISAPI.searchClient(
            response.clientID,
            // limit
            10,
            // useCurrentUserObject
            false
          );
          if (hmisClientSearch.length > 0) {
            response.clientDetails = hmisClientSearch[0];
            response.isHMISClient = true;
            let schema = 'v2015';
            if (response.clientDetails.link
                && response.clientDetails.link.indexOf('v2014') !== -1) {
              schema = 'v2014';
            }
            response.clientSchema = schema;
          }
        }
        self.added('responses', response._id, response);
        self.ready();
      }
    }

    return self.ready();
  }
);
