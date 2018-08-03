import { logger } from '/imports/utils/logger';
import { HmisClient } from '/imports/api/hmisApi';

Meteor.publish('globalEnrollments.all', function publishAllGlobalEnrollments() {
  logger.info(`PUB[${this.userId}]: globalEnrollments.all`);
  if (!this.userId) {
    return [];
  }

  const hc = HmisClient.create(this.userId);
  const enrollments = hc.api('global').getGlobalEnrollments();
  enrollments.map(e => this.added('globalEnrollments', e.id, e));
  return this.ready();
});


Meteor.publish('globalEnrollments.one', function publishOneGlobalEnrollment(globalEnrollmentId) {
  logger.info(`PUB[${this.userId}]: globalEnrollments.one`, globalEnrollmentId);
  if (!this.userId) {
    return [];
  }

  const hc = HmisClient.create(this.userId);
  const enrollment = hc.api('global').getGlobalEnrollment(globalEnrollmentId);
  this.added('globalEnrollments', enrollment.id, enrollment);
  return this.ready();
});
