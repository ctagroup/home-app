class SurveysRepository {
  constructor({ hmisClient, logger }) {
    this.hc = hmisClient;
    this.logger = logger;
  }

  getSurvey(surveyId) {
    const theirSurvey = this.hc.api('survey2').getSurvey(surveyId);
    const definition = JSON.parse(theirSurvey.surveyDefinition || 'null');

    const ourSurvey = _.omit({
      ...theirSurvey,
      definition,
    }, 'surveyDefinition');

    return ourSurvey;
  }
}

export default SurveysRepository;
