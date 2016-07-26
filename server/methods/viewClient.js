/**
 * Created by udit on 20/06/16.
 */

Meteor.methods(
  {
    getHMISClient(apiUrl) {
      const client = HMISAPI.getClientFromUrl(apiUrl);
      return client;
    },
    getEnrollments(clientId) {
      const enrollments = HMISAPI.getEnrollments(clientId);
      return enrollments;
    },
  }
);
