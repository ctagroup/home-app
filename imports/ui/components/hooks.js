import { useCurrentUser, useMongoFetch } from 'react-meteor-hooks';
import Surveys from '/imports/api/surveys/surveys';
import Projects from '/imports/api/projects/projects';

export function usePermission(role) {
  const user = useCurrentUser();
  return Roles.userIsInRole(user, role);
}

export function useSurvey(surveyId) {
  const surveys = useMongoFetch(Surveys.find(surveyId), [surveyId]);

  if (surveys.length === 0) {
    return null;
  }

  const survey = surveys[0];
  const definition = JSON.parse(survey.definition);

  return {
    ...survey,
    definition: {
      ...definition,
      title: definition.title || survey.title,
    },
  };
}

export function useProject(projectId) {
  const projects = useMongoFetch(Projects.find(projectId), [projectId]);

  if (projects.length === 0) {
    return null;
  }

  return projects[0];
}
