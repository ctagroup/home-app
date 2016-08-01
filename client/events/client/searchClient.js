/**
 * Created by udit on 20/06/16.
 */

Template.searchClient.onRendered(
  () => {
    Meteor.typeahead.inject();
  }
);

Template.searchClient.events(
  {
    'click .client-search-icon-container': () => {
      $('#search-client-keyword').focus();
    },
  }
);
