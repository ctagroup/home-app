import React from 'react';
import { computeFormState } from '/imports/api/surveys/computations';
import Section from '/imports/ui/components/surveyForm/Section';
import { ResponseStatus } from '/imports/api/responses/responses';
import Alert from '/imports/ui/alert';
import { fullName } from '/imports/api/utils';
import { logger } from '/imports/utils/logger';
import { RecentClients } from '/imports/api/recent-clients';
import Survey from './Survey';

export default class EnrollmentAsSurvey extends Survey {
  handleSubmit(uploadSurvey, uploadClient) {
    Alert.error('Not yet implemented');
  }
}
