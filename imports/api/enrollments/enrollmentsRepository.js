

// EnrollmentsRepository acts as ACL to HMIS API

// http://localhost:3000/clients/b4f57077-fc53-47c3-9445-bb3c86f223a7/enrollments/b398c95d-b099-414e-972a-f8617281d723?schema=v2017&surveyId=cee4029f-4a93-453e-ba3b-21db7186a8d2

import EnrollmentExpander from './EnrollmentExpander';


class EnrollmentsRepository {
  constructor({ logger, hmisClient, enrollmentsTranslationService }) {
    this.logger = logger;
    this.hmisClient = hmisClient;
    this.translationService = enrollmentsTranslationService;
  }

  getClientEnrollment(clientId, schema, enrollmentId, dataCollectionStage) {
    const enrollment = this.hmisClient
      .api('client')
      .getClientEnrollment(clientId, schema, enrollmentId);

    const expander = new EnrollmentExpander(enrollment, this.hmisClient);
    const submissionDates = expander.getSubmissionDates();
    if (submissionDates.length) {
      const latestDate = submissionDates.pop();
      expander.filterByDateEqualOrLessThanBy(latestDate, 2 * 60);
    }
    if (dataCollectionStage) expander.filterByDataCollectionStage(dataCollectionStage);

    return {
      enrollmentId,
      ...expander.expandLinks().toFullEnrollmentObject(),
    };
  }
}

export default EnrollmentsRepository;
