import { logger } from '/imports/utils/logger';
import Agencies from '/imports/api/agencies/agencies';
import ConsentGroups, { ConsentGroupStatus } from './consentGroups';

// import { HmisClient } from '/imports/api/hmisApi';

Meteor.methods({
  'consentGroups.create'(doc) {
    logger.info(`METHOD[${this.userId}]: consentGroups.create`, doc);
    const group = {
      ...doc,
      status: ConsentGroupStatus.NEW,
    };
    check(group, ConsentGroups.schema);
    return ConsentGroups.insert(group);
  },

  'consentGroups.update'(doc, id) {
    logger.info(`METHOD[${this.userId}]: consentGroups.update`, doc, id);
    const currentStatus = ConsentGroups.findOne(id).status;
    if (currentStatus !== ConsentGroupStatus.NEW) {
      throw new Meteor.Error(400, `Cannot edit ${currentStatus} consent group`);
    }
    check(doc, ConsentGroups.schema);
    return ConsentGroups.update(id, doc);
  },

  'consentGroups.updateStatus'(id) {
    // TODO: make call to global consents, search for this consent group
    // if consents exist, change status to active
    logger.info(`METHOD[${this.userId}]: consentGroups.update`, id);
  },

  'consentGroups.getProjectsForCurrentUser'() {
    logger.info(`METHOD[${this.userId}]: consentGroups.getProjectsForCurrentUser`);
    const user = Meteor.users.findOne(this.userId);

    if (!user || !user.activeProject) {
      return {
        view: [],
        edit: [],
      };
    }

    const userAgencies = Agencies.find({ 'projectsMembers.userId': this.userId }).fetch();
    const userAgenciesIds = userAgencies.map(a => a._id);

    const projectsWithViewAccess = userAgencies.reduce((all, agency) =>
      ([...all, ...agency.projects]),
      []
    );
    const userConsentGroups = ConsentGroups
      .find({ agencies: { $in: { userAgenciesIds } } })
      .fetch();
    console.log('ucg', userConsentGroups);
    console.log(projectsWithViewAccess);

    return {
      view: [],
      edit: [user.activeProject],
    };
  },

});
