import HmisCounts from './hmisCounts';
import { PendingClients } from '/imports/api/pendingClients/pendingClients';
import Surveys from '/imports/api/surveys/surveys';
import Responses from '/imports/api/responses/responses';


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

Meteor.publish('collectionsCount', function publishCollectionCount() {
  if (!this.userId) {
    return [];
  }

  const handles = [];
  const self = this;

  handles.push(publishCounts(PendingClients, 'clients', this));
  handles.push(publishCounts(Surveys, 'surveys', this));
  handles.push(publishCounts(Responses, 'responses', this));
  handles.push(publishCounts(Meteor.users, 'users', this));

  const counter = new HmisCounts(this.userId);
  _.map({
    eligibleClients: counter.getEligibleClientsCount,
    housingMatch: counter.getHousingMatchCount,
    housingUnits: counter.getHousingUnitsCount,
    globalHouseholds: counter.getGlobalHouseholdsCount,
    questions: counter.getQuestionsCount,
  }, (fn, name) => {
    self.added('collectionsCount', name, { count: 0, loading: true });
    Meteor.defer(() => {
      const count = fn.bind(counter)();
      self.changed('collectionsCount', name, { count, loading: false });
    });
  });
  self.ready();

  self.onStop(
    () => _.each(handles, handle => handle.stop())
  );
  return self.ready();
});
