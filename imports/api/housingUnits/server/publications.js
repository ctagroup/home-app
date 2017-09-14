import { eachLimit } from 'async';
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
    const queue = [];
    for (let i = 0; i < housingUnits.length && !stopFunction; i += 1) {
      if (fetchProjectsDetails && housingUnits[i].projectId) {
        housingUnits[i].project = { loading: true };
        let schema = 'v2015';
        if (housingUnits[i].links && housingUnits[i].links.length > 0
          && housingUnits[i].links[0].rel.indexOf('v2014') !== -1) {
          schema = 'v2014';
        }
        queue.push({
          i,
          projectId: housingUnits[i].projectId,
          schema,
        });
      }
      self.added('housingUnits', housingUnits[i].housingInventoryId, housingUnits[i]);
    }
    self.ready();

    const projectsCache = {};
    eachLimit(queue, Meteor.settings.connectionLimit, (data, callback) => {
      if (stopFunction) {
        callback();
        return;
      }
      const { i, projectId, schema } = data;

      if (!projectsCache[projectId]) {
        // get project and cache it
        Meteor.defer(() => {
          let project;
          try {
            project = hc.api('client').getProject(projectId, schema);
          } catch (e) {
            project = { error: e.reason };
          }
          projectsCache[projectId] = project;
          housingUnits[i].project = projectsCache[projectId];
          self.changed('housingUnits', housingUnits[i].housingInventoryId, housingUnits[i]);
          callback();
        });
      } else {
        // react project from cache
        housingUnits[i].project = projectsCache[projectId];
        self.changed('housingUnits', housingUnits[i].housingInventoryId, housingUnits[i]);
        callback();
      }
    });
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
