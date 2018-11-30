// EnrollmentsRepository acts as ACL to HMIS API

// http://localhost:3000/clients/b4f57077-fc53-47c3-9445-bb3c86f223a7/enrollments/b398c95d-b099-414e-972a-f8617281d723?schema=v2017&surveyId=cee4029f-4a93-453e-ba3b-21db7186a8d2

class EnrollmentsRepository {
  constructor({ logger, hmisClient, enrollmentsTranslationService }) {
    this.logger = logger;
    this.hmisClient = hmisClient;
    this.translationService = enrollmentsTranslationService;
  }

  getClientEnrollment(clientId, schema, enrollmentId) {
    const hmisEnrollment = this.hmisClient
      .api('client')
      .getClientEnrollment(clientId, schema, enrollmentId);
    const translatedEnrollment = this.translationService.translateFromForeign(hmisEnrollment);
    return {
      enrollmentId,
      ...translatedEnrollment,
    };
  }
}

export default EnrollmentsRepository;
