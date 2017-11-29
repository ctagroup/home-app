import SurveyQuestionsMaster from '/imports/api/surveys/surveyQuestionsMaster'; // old code


export function mapUploadedSurveySections(surveySectionsApiResponse) {
  return surveySectionsApiResponse.map(s => ({
    // sectionText stores the type of section i.e. scoring, default (for questions)
    type: s.sectionText,
    // sectionDetail stores internal form element id
    id: s.sectionDetail,
    hmisId: s.surveySectionId,
  }));
}


export function getSurveySections(surveyId) {
  // Receive surveyId for which the sections have to be sent.
  // TODO: unused?
  return SurveyQuestionsMaster.find(
    { $and: [
      { surveyID: surveyId }, { contentType: 'section' },
    ] },
    { sort: { order: 1 } }).fetch();
}

export function getSurveyQuestionsPerSection(sectionId) {
  // TODO: unused?
  return SurveyQuestionsMaster.find(
    { sectionID: sectionId },
    { sort: { order: 1 },
    } // Apparently only section ID is enough, so not using survey ID for this.
  ).fetch();
}

