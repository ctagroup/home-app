/**
 * Created by udit on 16/11/16.
 */

Meteor.methods(
  {
    postHousingMatchScores() {
      return HMISAPI.postHousingMatchScores();
    },
  }
);
