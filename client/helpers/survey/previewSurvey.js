Template.previewSurvey.helpers(
  {
    editSurveyPath(id) {
      return Router.path('adminDashboardsurveysEdit', { _id: id });
    },
  }
);
