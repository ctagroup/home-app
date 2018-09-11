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
    const getDefinition = (definition) => {
      if (typeof definition === 'string') {
        return JSON.parse(definition);
      }
      return definition;
    };
    return (this.questions || [])
      .map(q => {
        try {
          return {
            ...getDefinition(q.definition),
            hmisId: q.questionId,
            schema: q.schema,
            hudQuestion: q.hudQuestion,
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
