/**
 * Created by udit on 20/06/16.
 */

Meteor.methods(
  {
    getHMISClient(clientId, apiUrl) {
      const client = HMISAPI.getClientFromUrl(apiUrl);
      const enrollments = HMISAPI.getEnrollments(clientId);
      client.enrollments = enrollments;
      return client;
    },
    getEnrollments(clientId) {
      const enrollments = HMISAPI.getEnrollments(clientId);
      return enrollments;
    },
  }
);
