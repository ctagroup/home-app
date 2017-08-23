import SurveyQuestionsMaster from '/imports/api/surveys/surveyQuestionsMaster';


export function getSurveySections(surveyId) {
  // Receive surveyId for which the sections have to be sent.
  return SurveyQuestionsMaster.find(
    { $and: [
      { surveyID: surveyId }, { contentType: 'section' },
    ] },
    { sort: { order: 1 } }).fetch();
}

export function getSurveyQuestionsPerSection(sectionId) {
  return SurveyQuestionsMaster.find(
    { sectionID: sectionId },
    { sort: { order: 1 },
    } // Apparently only section ID is enough, so not using survey ID for this.
  ).fetch();
}

