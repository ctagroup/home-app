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
    'click .createHousehold': () => {
      const globalHouseholdObject = {};
      const globalHouseholdMembers = [];
      globalHouseholdObject.globalHouseholdId = null;
      globalHouseholdObject.headOfHouseholdId = $('input[name=ishoh]:checked').val();
      globalHouseholdObject.dateCreated = '';
      globalHouseholdObject.dateUpdated = '';
      globalHouseholdObject.userCreate = Meteor.userId();
      globalHouseholdObject.userUpdate = Meteor.userId();
      $('.sClients').find('tr').each(
        (i, item) => {
          const optionArray = {};
          optionArray.houseHoldMembershipId = null;
          optionArray.globalClientId = $(item).find('#clientID').text();
          optionArray.relationshipToHeadOfHouseHold = $(item).find('.relationshiptohoh').val();
          optionArray.userCreate = Meteor.userId();
          optionArray.userUpdate = Meteor.userId();
          optionArray.globalHouseHoldId = '';
          globalHouseholdMembers.push(optionArray);
        }
      );
      Meteor.call('createGlobalHousehold', globalHouseholdMembers,
        globalHouseholdObject, (err, res) => {
          if (err) {
            logger.log(err);
          } else {
            Session.set('createdHousehold', res);
          }
          return;
        });
      delete Session.keys.selectedClients;
    },
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
