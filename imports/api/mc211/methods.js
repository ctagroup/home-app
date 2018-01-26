import Files from '/imports/api/files/files';
import { HmisClient } from '/imports/api/hmisApi';
import { logger } from '/imports/utils/logger';
import { fullName } from '/imports/api/utils';


Meteor.methods({
  'mc211.approveClientFiles'(client) {
    logger.info(`METHOD[${Meteor.userId()}]: mc211.approveClientFiles`, client);
    Files.update({ clientId: client.clientId }, { $set: { status: 'approved' } }, { multi: true });
    const hc = HmisClient.create(Meteor.userId());
    try {
      const email = {
        title: 'Application Approval, Cal Am Water Hardship Benefit Program',
        body: `
          <p>Dear Customer ${fullName(client)},<br>
          Thank you for your application. We are pleased to let you know that it has been
          reviewed and approved. You will see payment made on your behalf on your next billing
          statement in the amount that is due, up to the limit of the benefit program.</p>
          <p>Sincerely,<br>United Way Monterey County</p>
        `,
        recipient: client.emailAddress,
      };
      const additionalInfo = {
        messageType: 'mc211 approval',
        recipientType: 'clientID',
        recipientId: client.clientId,
      };
      hc.api('global').sendEmailNotification(email, additionalInfo);
    } catch (e) {
      logger.error(e);
      throw new Meteor.Error('Failed to send email');
    }
  },
  'mc211.rejectClientFiles'(client) {
    logger.info(`METHOD[${Meteor.userId()}]: mc211.rejectClientFiles`, client);
    Files.update({ clientId: client.clientId }, { $set: { status: 'rejected' } }, { multi: true });
    const hc = HmisClient.create(Meteor.userId());
    try {
      const email = {
        title: 'Ineligible for Cal Am Water Hardship Benefit Program',
        body: `
          <p>Dear Customer ${fullName(client)},<br>
          After reviewing your application, we regret that it does not meet the criteria
          for approval. If you would like to review this decision, please contact United Way
          Monterey County at <strong>(831) 372-8026 extension 114</strong>.  We have notified
          California American Water regarding the rejection of your application.  You should
          reach out to their Customer Service immediately to discuss a different payment
          arrangement or options. Customer Service contact number is
          <strong>(888) 237-1333</strong>.</p>
          <p>Sincerely,<br>United Way Monterey County</p>
        `,
        recipient: client.emailAddress,
      };
      const additionalInfo = {
        messageType: 'mc211 rejection',
        recipientType: 'clientID',
        recipientId: client.clientId,
      };
      hc.api('global').sendEmailNotification(email, additionalInfo);
    } catch (e) {
      logger.error(e);
      throw new Meteor.Error('Failed to send email');
    }
  },
});
