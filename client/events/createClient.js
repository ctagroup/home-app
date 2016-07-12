Template.createClient.onRendered(() => {
  const template = Template.instance();
  template.autorun(() => {
    if (!PreliminarySurvey.showDVQuestion()) {
      if (!PreliminarySurvey.showHousingSurveyQuestion()) {
        PreliminarySurvey.showReleaseOfInformation();
      }
    }
  });
});
