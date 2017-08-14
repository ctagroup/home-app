Meteor.methods(
  {
    postHousingMatches() {
      return HMISAPI.postHousingMatch();
    },
  }
);
