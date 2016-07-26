/**
 * Created by udit on 12/12/15.
 */

Template.appNav.helpers(
  {
    isClientsRoute() {
      const clientPages = [
        'searchClient',
        'createClient',
        'editClient',
        'viewClient',
        'LogSurvey',
        'LogSurveyResponse',
      ];
      return $.inArray(Router.current().route.getName(), clientPages) !== -1 ? 'active' : '';
    },
    isSurveysRoute() {
      return $.inArray(Router.current().route.getName(), ['surveyStatus']) !== -1 ? 'active' : '';
    },
    isChatRoute() {
      return $.inArray(Router.current().route.getName(), ['chat']) !== -1 ? 'active' : '';
    },
  }
);
