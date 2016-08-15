/**
 * Created by Mj on 09-Aug-16.
 */

surveyFormatHelpers = {
  getSections(surveyId) {
    // Receive surveyId for which the sections have to be sent.
    return surveyQuestionsMaster.find(
      { $and: [
        { surveyID: surveyId }, { contentType: 'section' },
      ] },
      { sort: { order: 1 } }).fetch();
  },
  getQuestionsPerSection(sectionId) {
    return surveyQuestionsMaster.find(
      { sectionID: sectionId },
      { sort: { order: 1 },
      } // Apparently only section ID is enough, so not using survey ID for this.
    ).fetch();
  },
};
