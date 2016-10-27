/**
 * Created by udit on 20/06/16.
 */




Template.searchClient.onRendered(
  () => {
    Meteor.typeahead.inject();

  //    const template = Template.instance();
  // template.autorun(() => {
  //   if (!PreliminarySurvey.showPreliminarySurvey()) {
  //     PreliminarySurvey.showReleaseOfInformation();
  //   }
  // });

  });

Template.searchClient.events(
  {
    'click .client-search-icon-container': () => {
      $('#search-client-keyword').focus();
    },
  }
);


