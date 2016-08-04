/**
 * Created by Anush-PC on 8/1/2016.
 */
Template.globalHouseholdCreateView.onRendered(
  () => {
    Meteor.typeahead.inject();
  }
);

Template.globalHouseholdCreateView.events(
  {
    // 'click .createHousehold': () => {
    //    //insert into hmis
    // },
    'click .cancelHousehold': () => {
      delete Session.keys.selectedClients;
    },
  }
);

Template.globalHouseholdAddClients.events(
  {
    'click .selectClients'(evt, tmpl) {
      delete Session.keys.selectedClients;
      evt.preventDefault();
      const selected = tmpl.findAll('input[type=checkbox]:checked');
      let array = [];
      array = selected.map((item) => {
        const clientId = item.value.split('|')[0];
        const clientName = item.value.split('|')[1];
        return { clientId, clientName };
      });
      Session.set('selectedClients', array);
      history.go(-1);
    },
  });
