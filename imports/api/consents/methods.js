import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import Agencies from '/imports/api/agencies/agencies';
import { logger } from '/imports/utils/logger';
import Users from '/imports/api/users/users';
import ConsentGroups from '/imports/api/consentGroups/consentGroups';
import { HmisClient } from '/imports/api/hmisApi';
import { ConsentPermission } from '/imports/api/consents/consents';
import { getProjectsForUser } from '/imports/api/consentGroups/methods';
import Responses from '/imports/api/responses/responses';

const SECONDS_PER_YEAR = 31556926;
export const DEFAULT_CONSENT_DURATION_IN_SECONDS = 3 * SECONDS_PER_YEAR;

function createClientConsent(hc, globalClientId, consentGroupId, projectIds,
  durationInSeconds = DEFAULT_CONSENT_DURATION_IN_SECONDS, startTimestamp = null) {
  logger.debug('creating consent for', consentGroupId, projectIds);
  const consentId = hc.api('global').createClientConsent(
    globalClientId, consentGroupId, projectIds,
    durationInSeconds, startTimestamp
  );
  return consentId;
}

Meteor.methods({
  'consents.create'(globalClientId, consentGroupId,
    durationInSeconds, startTimestamp) {
    logger.info(`METHOD[${this.userId}]: consents.create`, globalClientId, consentGroupId);

    const user = Users.findOne(this.userId);

    if (!user.activeProject) {
      throw new Meteor.Error(400, 'No project selected');
    }
    const agency = Agencies.oneWhereUserHasActiveProject(user._id, user.activeProject);
    const agencyConsentGroups = ConsentGroups.find({ agencies: agency._id }).fetch();
    const consentGroup = ConsentGroups.findOne(consentGroupId);

    if (agencyConsentGroups.length === 0) {
      throw new Meteor.Error(400, 'Active agency does not belong to any consent group');
    }

    const consentGroupIds = agencyConsentGroups.map(cg => cg._id);

    const hc = HmisClient.create(this.userId);

    if (!consentGroup) {
      throw new Meteor.Error(404, `Consent group ${consentGroupId} does not exist`);
    }

    if (!consentGroupIds.includes(consentGroupId)) {
      throw new Meteor.Error(400,
        `Active agency does not belong to consent group ${consentGroupId}`
      );
    }
    createClientConsent(hc, globalClientId, consentGroupId,
      consentGroup.getAllProjects(),
      durationInSeconds,
      startTimestamp
    );
  },

  'consents.synchronizeProjects'() {
    logger.info(`METHOD[${this.userId}]: consents.synchronizeProjects`);
    const user = Users.findOne(this.userId);

    if (!user.activeProject) {
      throw new Meteor.Error(400, 'No project selected');
    }
    const agency = Agencies.oneWhereUserHasActiveProject(user._id, user.activeProject);
    const agencyConsentGroups = ConsentGroups.find({ agencies: agency._id }).fetch();
    if (agencyConsentGroups.length === 0) {
      throw new Meteor.Error(400, 'Active agency does not belong to any consent group');
    }

    let updatedCount = 0;
    logger.info('synchronizing consents in agency ', agency.name);
    const consentGroupIds = agencyConsentGroups.map(cg => cg._id);
    consentGroupIds.forEach(id => {
      logger.info('synchronizing consent in group', id);
      const consentGroup = ConsentGroups.findOne(id);
      const hc = HmisClient.create(this.userId);
      const consents = hc.api('global').searchConsents(id);
      const updatedProjects = consentGroup.getAllProjects();

      consents.forEach(consent => {
        const { clientId, consentId } = consent;
        hc.api('global').updateClientConsent(clientId, consentId, updatedProjects);
        updatedCount += 1;
      });
    });
    return updatedCount;
  },

  'consents.checkClientAccessByConsents'(consents) {
    logger.info(`METHOD[${this.userId}]: consents.checkClientAccessByConsents`, consents);
    const projectPermissions = getProjectsForUser(this.userId);

    const now = moment().unix();
    for (let i = 0; i < consents.length; i++) {
      const { globalProjects, startTime, endTime } = consents[i];
      if (startTime > now || endTime < now) {
        continue;
      }

      const consentProjectIds = globalProjects.map(p => p.id);
      const canEdit = projectPermissions.edit.some(id => consentProjectIds.includes(id));
      const canView = projectPermissions.view.some(id => consentProjectIds.includes(id));

      if (canEdit) {
        return ConsentPermission.EDIT;
      }
      if (canView) {
        return ConsentPermission.VIEW;
      }
    }
    return ConsentPermission.DENIED;
  },

  'consents.generateInitialConsent'({ clientId, dedupClientId }) {
    logger.info(`METHOD[${this.userId}]: consents.generateInitialConsent`, clientId, dedupClientId);

    const consentGroup = ConsentGroups.findOne('MOSBE_CARS');

    if (!clientId || !dedupClientId || !consentGroup) {
      logger.warn('failed to create initial consent', clientId, dedupClientId, consentGroup);
      return;
    }

    let startDate;
    const response = Responses.findOne({ clientId }, { sort: { createdAt: 1 } });
    if (response) {
      logger.info('new consent will created based on response date for cient', dedupClientId);
      startDate = moment(response.createdAt).unix();
    } else {
      logger.warn('no data to create consent');
    }

    if (startDate) {
      const duration = DEFAULT_CONSENT_DURATION_IN_SECONDS;
      const hc = HmisClient.create(this.userId);
      hc.api('global').createClientConsent(dedupClientId,
        consentGroup._id,
        consentGroup.getAllProjects(),
        duration,
        startDate
      );
    }
  },
});
