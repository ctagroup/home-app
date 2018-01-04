import Surveys from '/imports/api/surveys/surveys';
import SurveyBuilder from '/imports/ui/components/surveyBuilder/SurveyBuilder.js';
import './surveyFormBuilder.html';

Template.surveyFormBuilder.helpers({
  component() {
    return SurveyBuilder;
  },

  survey() {
    return this.survey || {};
  },

  questions() {
    return (this.questions || [])
      .map(q => {
        try {
          return {
            ...JSON.parse(q.definition),
            hmisId: q.questionId,
          };
        } catch (e) {
          return null;
        }
      })
      .filter(q => q !== null);
  },

  schema() {
    return Surveys.schema;
  },
});
