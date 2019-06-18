import React, { useEffect } from 'react';
import { useMethod } from 'react-meteor-hooks';
import { usePermission, useSurvey, useProject } from '/imports/ui/components/hooks';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import Survey from '/imports/ui/components/surveyForm/Survey';


export function SurveyLoader({ surveyId, client, projectId, enrollmentInfo,
    isEnrollment, initialValues, response, onSubmit }) {
  if (!surveyId || !projectId) return null;

  const surveysGetMethod = useMethod('surveys.get');
  const project = useProject(projectId);
  const isAdmin = usePermission(DefaultAdminAccessRoles);

  useEffect(() => {
    surveysGetMethod.call(surveyId);
  }, [surveyId]);

  if (surveysGetMethod.data === null || surveysGetMethod.loading) {
    return <p>Loading survey...</p>;
  }

  if (surveysGetMethod.error) {
    return <p>An error ocurred while loading survey</p>;
  }

  const survey = surveysGetMethod.data;

  console.log('pp', project);

  if (!project) {
    return <p>Project {projectId} not found</p>;
  }


  return (
    <Survey
      surveyId={surveyId}
      definition={survey.definition}
      client={client}
      debugMode={isAdmin}
      project={project}
      isEnrollment={isEnrollment}
      enrollmentInfo={enrollmentInfo}
      initialValues={initialValues}
      response={response}
      onSubmit={onSubmit}
    />
  );
}
