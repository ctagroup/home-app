import { logger } from '/imports/utils/logger';
import Agencies from '/imports/api/agencies/agencies';
import ConsentGroups, { ConsentGroupStatus } from './consentGroups';

// import { HmisClient } from '/imports/api/hmisApi';

export function getProjectsForUser(userId) {
  const user = Meteor.users.findOne(userId);

  if (!user || !user.activeProject) {
    logger.debug('no user or active project');
    return {
      view: [],
      edit: [],
    };
  }

  const userAgencies = Agencies.find({ 'projectsMembers.userId': userId }).fetch();

  const userAgenciesIds = userAgencies.map(a => a._id);

  const userConsentGroups = ConsentGroups
    .find({ agencies: { $in: userAgenciesIds } })
    .fetch();

  const agencyIdsInConsentGroups = userConsentGroups.reduce(
    (all, cg) => ([...all, ...cg.agencies]), []
  );


  const allAgencyIds = [...userAgenciesIds, ...agencyIdsInConsentGroups];
  const allAgencies = Agencies.find({ _id: { $in: allAgencyIds } }).fetch();
  const allProjects = allAgencies.reduce(
    (all, agency) => ([...all, ...agency.projects]), []
  );

  return {
    view: allProjects,
    edit: [user.activeProject],
  };
}


Meteor.methods({
  'consentGroups.create'(doc) {
    logger.info(`METHOD[${this.userId}]: consentGroups.create`, doc);
    const group = {
      ...doc,
      status: ConsentGroupStatus.NEW,
    };
    check(group, ConsentGroups.schema);
    return ConsentGroups.insert({
      _id: group.name,
      ...group,
    });
  },

  'consentGroups.update'(doc, id) {
    logger.info(`METHOD[${this.userId}]: consentGroups.update`, doc, id);
    const currentStatus = ConsentGroups.findOne(id).status;
    if (currentStatus !== ConsentGroupStatus.NEW) {
      throw new Meteor.Error(400, `Cannot edit ${currentStatus} consent group`);
    }
    check(doc, ConsentGroups.schema);
    const updatedCount = Meteor.call('consents.synchronizeProjects');
    ConsentGroups.update(id, doc);
    ConsentGroups.update(id, { $set: {
      status: updatedCount ? ConsentGroupStatus.ACTIVE : ConsentGroupStatus.NEW,
    } });
  },

  'consentGroups.updateStatus'(id) {
    // TODO: make call to global consents, search for this consent group
    // if consents exist, change status to active
    logger.info(`METHOD[${this.userId}]: consentGroups.updateStatus`, id);
  },

  'consentGroups.getProjectsForCurrentUser'() {
    logger.info(`METHOD[${this.userId}]: consentGroups.getProjectsForCurrentUser`);
    return getProjectsForUser(this.userId);
  },
});
