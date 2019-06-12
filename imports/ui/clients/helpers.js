import Agencies from '/imports/api/agencies/agencies';

export function getEnrollmentSurveyIdForProject(projectId, surveyType) {
  if (projectId) {
    const agencies = Agencies.find().fetch();
    const selectedAgency =
      agencies.find((agency) => agency.getProjectSurveyId(projectId, surveyType));
    return selectedAgency && selectedAgency.getProjectSurveyId(projectId, surveyType);
  }
  return false;
}
