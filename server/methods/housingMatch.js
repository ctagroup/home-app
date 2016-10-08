/**
 * Created by Mj on 10/8/2016.
 */

Meteor.methods(
  {
    postHousingMatches() {
      return HMISAPI.postHousingMatch();
    },
  }
);
