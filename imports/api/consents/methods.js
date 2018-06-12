import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import Agencies from '/imports/api/agencies/agencies';
import { logger } from '/imports/utils/logger';
import Users from '/imports/api/users/users';
import ConsentGroups from '/imports/api/consentGroups/consentGroups';
import { HmisClient } from '/imports/api/hmisApi';
import { ConsentPermission } from '/imports/api/consents/consents';
import { getProjectsForUser } from '/imports/api/consentGroups/methods';


function createClientConsent(hc, globalClientId, consentGroupId, projectIds) {
  const consentId = hc.api('global').createClientConsent(
    globalClientId, consentGroupId, projectIds
  );
  return consentId;
}

Meteor.methods({
  'consents.create'(globalClientId, consentGroupId) {
    logger.info(`METHOD[${this.userId}]: consents.create`, globalClientId);

    const user = Users.findOne(this.userId);

    const agency = Agencies.oneWhereUserHasActiveProject(user._id, user.activeProject);
    const consentGroup = ConsentGroups.findOne(consentGroupId);
    const consentGroups = ConsentGroups.find({ agencies: agency._id }).fetch();
    const consentGroupIds = consentGroups.map(cg => cg._id);

    if (consentGroupId && !consentGroupIds.includes(consentGroupId)) {
      throw new Meteor.Error(400, 'Incorrect consent group');
    }

    if (!consentGroup) {
      throw new Meteor.Error(400, 'Consent group does not exist');
    }

    const hc = HmisClient.create(this.userId);

    if (!consentGroupId) {
      return createClientConsent(hc, globalClientId, null, agency.projects);
    }

    return createClientConsent(hc, globalClientId, consentGroupId, consentGroup.getAllProjects());
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
