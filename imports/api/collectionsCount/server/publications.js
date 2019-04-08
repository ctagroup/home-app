import HmisCounts from './hmisCounts';
import Surveys from '/imports/api/surveys/surveys';
import Responses from '/imports/api/responses/responses';
import { HmisCache } from '/imports/api/cache/hmisCache';


function publishCounts(collection, collectionName, publication) {
  let count = 0;
  publication.added('collectionsCount', collectionName, { count });

  const handle = collection.find().observeChanges({
    added() {
      count += 1;
      publication.changed('collectionsCount', collectionName, { count });
    },
    removed() {
      count -= 1;
      publication.changed('collectionsCount', collectionName, { count });
    },
  });
  return handle;
}

Meteor.publish('collectionsCount', function publishCollectionCount(forceReload = true) {
  if (!this.userId) {
    return [];
  }

  const handles = [
    publishCounts(Surveys, 'surveys', this),
    publishCounts(Responses, 'responses', this),
    publishCounts(Meteor.users, 'users', this),
  ];

  const self = this;
  const counter = new HmisCounts(this.userId);

  _.map({
    clients: counter.getEligibleClientsCount,
    eligibleClients: counter.getEligibleClientsCount,
    housingMatch: counter.getHousingMatchCount,
    housingUnits: counter.getHousingUnitsCount,
    globalHouseholds: counter.getGlobalHouseholdsCount,
    questions: counter.getQuestionsCount,
  }, (fn, name) => {
    self.added('collectionsCount', name, { count: 0, loading: true });
    Meteor.defer(() => {
      const count = HmisCache.getData(
        `collectionsCount.${name}`, this.userId, fn.bind(counter), forceReload
      );
      self.changed('collectionsCount', name, { count, loading: false });
    });
  });
  self.ready();

  self.onStop(
    () => _.each(handles, handle => handle.stop())
  );
  return self.ready();
});
