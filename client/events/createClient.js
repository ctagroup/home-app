Template.createClient.onRendered(() => {
  const template = Template.instance();
  template.autorun(() => {
    if (!PreliminarySurvey.showPreliminarySurvey()) {
      PreliminarySurvey.showReleaseOfInformation();
    }
  });
});
