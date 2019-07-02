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

// use-global-hook
function setState(newState) {
  this.state = { ...this.state, ...newState };
  this.listeners.forEach((listener) => {
    listener(this.state);
  });
}

function useCustom(React) {
  const newListener = React.useState()[1];
  React.useEffect(() => {
    this.listeners.push(newListener);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== newListener);
    };
  }, []);
  return [this.state, this.actions];
}

function associateActions(store, actions) {
  const associatedActions = {};
  Object.keys(actions).forEach((key) => {
    if (typeof actions[key] === 'function') {
      associatedActions[key] = actions[key].bind(null, store);
    }
    if (typeof actions[key] === 'object') {
      associatedActions[key] = associateActions(store, actions[key]);
    }
  });
  return associatedActions;
}

export const useStore = (React, initialState, actions, initializer) => {
  const store = { state: initialState, listeners: [] };
  store.setState = setState.bind(store);
  store.actions = associateActions(store, actions);
  if (initializer) initializer(store);
  return useCustom.bind(store, React);
};
