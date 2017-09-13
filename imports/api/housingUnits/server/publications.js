import { HmisClient } from '/imports/api/hmis-api';
import { logger } from '/imports/utils/logger';

Meteor.publish(
  'housingUnits.list', function publishAllHousingUnits(fetchProjectsDetails = true) {
    logger.info(`PUB[${this.userId}]: housingUnits.list`);
    const self = this;
    let stopFunction = false;
    self.unblock();

    self.onStop(() => {
      stopFunction = true;
    });

    const hc = HmisClient.create(this.userId);
    const housingUnits = hc.api('housing').getHousingUnits();

    // populate the list without the details
    for (let i = 0; i < housingUnits.length && !stopFunction; i += 1) {
      housingUnits[i].project = { loading: true };
      self.added('housingUnits', housingUnits[i].housingInventoryId, housingUnits[i]);
    }
    self.ready();

    if (fetchProjectsDetails) {
      const projectsCache = {};
      // TODO: use async data loading
      for (let i = 0; i < housingUnits.length && !stopFunction; i += 1) {
        const projectId = housingUnits[i].projectId;
        let project;
        if (!projectsCache[projectId]) {
          try {
            let schema = 'v2015';
            if (housingUnits[i].links && housingUnits[i].links.length > 0
                && housingUnits[i].links[0].rel.indexOf('v2014') !== -1) {
              schema = 'v2014';
            }
            project = hc.api('client').getProject(housingUnits[i].projectId, schema);
          } catch (e) {
            project = { error: e.reason };
          }
          projectsCache[projectId] = project;
        }
        housingUnits[i].project = projectsCache[projectId];
        self.changed('housingUnits', housingUnits[i].housingInventoryId, housingUnits[i]);
      }
    }
  }
);

Meteor.publish(
  'housingUnits.one', function publishOneHousingUnit(housingUnitId) {
    logger.info(`PUB[${this.userId}]: housingUnits.one`, housingUnitId);
    const hc = HmisClient.create(this.userId);
    const housingUnit = hc.api('housing').getHousingUnit(housingUnitId);

    let schema = 'v2015';
    if (housingUnit.links && housingUnit.links.length > 0
        && housingUnit.links[0].rel.indexOf('v2014') !== -1) {
      schema = 'v2014';
    }

    try {
      const project = hc.api('client').getProject(housingUnit.projectId, schema);
      housingUnit.project = project;
    } catch (e) {
      housingUnit.project = { error: e.reason };
    }

    this.added('housingUnits', housingUnit.housingInventoryId, housingUnit);
    this.ready();
  }
);
