import HmisCounts from './hmisCounts';
import Responses from '/imports/api/responses/responses';
// import { HmisCache } from '/imports/api/cache/hmisCache';


// eslint-disable-next-line no-unused-vars
Meteor.publish('collectionsCount', function publishCollectionCount(forceReload = true) {
  if (!this.userId) {
    return [];
  }

  const self = this;
  const counter = new HmisCounts(this.userId);

  _.map({
    clients: counter.getClientsCount,
    eligibleClients: counter.getEligibleClientsCount,
    housingMatch: counter.getHousingMatchCount,
    housingUnits: counter.getHousingUnitsCount,
    globalHouseholds: counter.getGlobalHouseholdsCount,
    questions: counter.getQuestionsCount,
    surveys: counter.getSurveysCount,
    users: counter.getUsersCount,
  }, (fn, name) => {
    self.added('collectionsCount', name, { count: 0, loading: true });
    Meteor.defer(() => {
      // const count = HmisCache.create(this.userId).getData(
      //   `collectionsCount.${name}`, fn.bind(counter), forceReload ||
      // );
      self.changed('collectionsCount', name, { count: fn.bind(counter)(), loading: false });
    });
  });
  self.ready();

  // for now make responses counter reactive
  self.added('collectionsCount', 'responses', { count: Responses.find().count(), loading: false });
  const responsesCounter = Meteor.setInterval(() => {
    const count = Responses.find().count();
    self.changed('collectionsCount', 'responses', { count });
  }, 3000);

  self.onStop(() => {
    Meteor.clearInterval(responsesCounter);
  });
  return self.ready();
});
