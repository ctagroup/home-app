import React from 'react';

import { usePermission, useSurvey, useProject } from '/imports/ui/components/hooks';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import Survey from '/imports/ui/components/surveyForm/Survey';


export function SurveyLoader({ surveyId, client, projectId, enrollmentInfo,
  isEnrollment, initialValues, response }) {
  const survey = useSurvey(surveyId);
  const project = useProject(projectId);
  const isAdmin = usePermission(DefaultAdminAccessRoles);

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
    />
  );
}
