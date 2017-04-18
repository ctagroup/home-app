/**
 * Created by udit on 27/10/16.
 */

import { PendingClients } from '/imports/api/clients/pending-clients';

Meteor.publish(
  'responses', function publishResponses(clientID) {
    const self = this;
    let stopFunction = false;
    self.unblock();

    self.onStop(() => {
      stopFunction = true;
    });

    if (self.userId && typeof responses !== 'undefined') {
      HMISAPI.setCurrentUserId(self.userId);
      let query = {};
      if (clientID) {
        query = { clientID };
      }
      const responseList = responses.find(query).fetch();
      // Publish the local data first, so the user can get a quick feedback.
      for (let i = 0, len = responseList.length; i < len; i++) {
        self.added('responses', responseList[i]._id, responseList[i]);
      }
      self.ready();

      // Get the non local data and publish it as soon as it's available.
      for (let i = 0, len = responseList.length; i < len && !stopFunction; i++) {
        const response = {};
        if (responseList[i].isHMISClient && responseList[i].clientSchema) {
          response.clientDetails = HMISAPI.getClient(
            responseList[i].clientID,
            responseList[i].clientSchema,
            // useCurrentUserObject
            false
          );
        } else {
          const localClient = PendingClients.findOne({ _id: responseList[i].clientID });

          if (localClient) {
            response.clientDetails = localClient;
          } else {
            const hmisClientSearch = HMISAPI.searchClient(
              responseList[i].clientID,
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
        }
        self.changed('responses', responseList[i]._id, response);
        if (i % 5 === 0) {
          self.ready();
        }
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
        self.ready();
      } else if (response) {
        const localClient = PendingClients.findOne({ _id: response.clientID });
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
