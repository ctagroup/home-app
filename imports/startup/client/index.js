import '/imports/ui/templateHelpers';
import '/imports/ui/eligibleClients/eligibleClientsListView';
import '/imports/ui/housingMatch/housingMatchListView';
import '/imports/ui/questions/questionsListView';
// S
// R
import '/imports/ui/housingUnits/housingUnitsListView';
import '/imports/ui/globalHouseholds/globalHouseholdListView';
import '/imports/ui/globalHouseholds/globalHouseholdCreateView';
import '/imports/ui/globalHouseholds/globalHouseholdEditView';

import '/imports/startup/client/routes';

Meteor.startup(() => {
  Meteor.subscribe('diExample.publication', 123, 456);
});
