/**
 * Created by udit on 26/07/16.
 */
import { HmisCounts } from '/imports/server/hmis-counts';
import { PendingClients } from '/imports/api/pending-clients/pending-clients';


function publishCounts(collection, collectionName, publication) {
  let count = 0;
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


Meteor.publish(
  'collectionsCount', function publishCollectionCount() {
    const handles = [];
    const self = this;

    _.each(AdminTables, (table, name) => {
      self.added('collectionsCount', name, { count: '.' });
    });
    self.ready();

    const counter = new HmisCounts(this.userId);
    _.map({
      eligibleClients: counter.getEligibleClientsCount,
      housingMatch: counter.getHousingMatchCount,
      housingUnits: counter.getHousingUnitsCount,
      globalHouseholds: counter.getGlobalHouseholdsCount,
    }, (fn, name) => {
      Meteor.setTimeout(() => {
        const count = fn.bind(counter)();
        self.changed('collectionsCount', name, { count });
      }, 0);
    });

    handles.push(publishCounts(PendingClients, 'clients', this));
    handles.push(publishCounts(questions, 'questions', this));
    handles.push(publishCounts(surveys, 'surveys', this));
    handles.push(publishCounts(responses, 'responses', this));
    handles.push(publishCounts(users, 'users', this));

    self.onStop(
      () => _.each(handles, handle => handle.stop())
    );
    return self.ready();
  }
);
