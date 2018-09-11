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
    const getDefinition = (q) => {
      if (typeof q.definition === 'string') {
        const definition = JSON.parse(q.definition);
        return definition;
      }
      return q.definition;
    };

    const allQuestions = (this.questions || [])
      .map(q => {
        try {
          const definition = getDefinition(q);
          const hmisQuestionTypes = {
            STRING: 'text',
            INTEGER: 'number',
            DROPDOWN: 'choice',
            CURRENCY: 'currency',
            DATE: 'date',
          };

          const category = hmisQuestionTypes[q.questionType];

          // import HUD question definition
          if (q.hudQuestion) {
            return {
              hmisId: q.questionId,
              title: q.displayText,
              type: 'question',
              category,
              options: q.options,
              enrollment: {
                schema: q.schema,
                uriObjectField: q.uriObjectField,
                updateUriTemplate: q.updateUriTemplate,
              },
            };
          }

          // import survey question definition
          return {
            ...definition,
            hmisId: q.questionId,
          };
        } catch (e) {
          return null;
        }
      })
      .filter(q => q !== null);
    return allQuestions;
  },

  schema() {
    return Surveys.schema;
  },
});
