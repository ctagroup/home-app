import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import Agencies from '/imports/api/agencies/agencies';
import { logger } from '/imports/utils/logger';
import Users from '/imports/api/users/users';
import ConsentGroups from '/imports/api/consentGroups/consentGroups';
import { HmisClient } from '/imports/api/hmisApi';
import { ConsentPermission } from '/imports/api/consents/consents';
import { getProjectsForUser } from '/imports/api/consentGroups/methods';

const SECONDS_PER_YEAR = 31556926;
const DEFAULT_CONSENT_DURATION_IN_SECONDS = 3 * SECONDS_PER_YEAR;

function createClientConsent(hc, globalClientId, consentGroupId, projectIds) {
  logger.debug('creating consent for', consentGroupId, projectIds);
  const consentId = hc.api('global').createClientConsent(
    globalClientId, consentGroupId, projectIds, DEFAULT_CONSENT_DURATION_IN_SECONDS
  );
  return consentId;
}

Meteor.methods({
  'consents.create'(globalClientId, consentGroupId) {
    logger.info(`METHOD[${this.userId}]: consents.create`, globalClientId, consentGroupId);

    const user = Users.findOne(this.userId);

    if (!user.activeProject) {
      throw new Meteor.Error(400, 'No project selected');
    }
    const agency = Agencies.oneWhereUserHasActiveProject(user._id, user.activeProject);
    const consentGroup = ConsentGroups.findOne(consentGroupId);
    const consentGroups = ConsentGroups.find({ agencies: agency._id }).fetch();
    const consentGroupIds = consentGroups.map(cg => cg._id);

    const hc = HmisClient.create(this.userId);

    if (consentGroupId) {
      if (!consentGroup) {
        throw new Meteor.Error(404, 'Consent group not found');
      }

      if (!consentGroupIds.includes(consentGroupId)) {
        throw new Meteor.Error(400, 'Incorrect consent group for current project');
      }
      return createClientConsent(hc, globalClientId, consentGroupId, consentGroup.getAllProjects());
    }
    return createClientConsent(hc, globalClientId, null, agency.projects);
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
});
