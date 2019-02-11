import '/imports/ui/templateHelpers';
// import '/imports/ui/dashboard/dashboard';
// import '/imports/ui/clients/searchClient';
// import '/imports/ui/clients/createClient';
// import '/imports/ui/clients/editClient';
// import '/imports/ui/clients/viewClient';
// import '/imports/ui/clients/manageClientEnrollments';
import '/imports/ui/eligibleClients/eligibleClientsListView';
import '/imports/ui/housingMatch/housingMatchListView';
import '/imports/ui/questions/questionsListView';
// S
// R
import '/imports/ui/housingUnits/housingUnitsListView';
import '/imports/ui/globalHouseholds/globalHouseholdListView';
import '/imports/ui/globalHouseholds/globalHouseholdCreateView';
import '/imports/ui/globalHouseholds/globalHouseholdEditView';
import '/imports/ui/clients/viewAllClient';

import '/imports/startup/client/routes';

Meteor.startup(() => {
  Meteor.subscribe('diExample.publication', 123, 456);
});
