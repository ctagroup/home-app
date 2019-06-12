import { useCurrentUser, useMongoFetch } from 'react-meteor-hooks';
import Surveys from '/imports/api/surveys/surveys';

export function usePermission(role) {
  const user = useCurrentUser();
  return Roles.userIsInRole(user, role);
}


export function useSurvey(surveyId) {
  const survey = useMongoFetch(Surveys.findOne(surveyId), [surveyId]);
  const definition = JSON.parse(survey.definition);

  return {
    ...survey,
    definition: {
      ...definition,
      title: definition.title || survey.title,
    },
  };
}
