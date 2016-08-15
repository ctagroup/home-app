/**
 * Created by Anush-PC on 8/1/2016.
 */
Template.globalHouseholdEditView.onRendered(
  () => {
    Meteor.typeahead.inject();
  }
);

Template.globalHouseholdEditView.events(
  {
    'click .updateHousehold': () => {
      const globalHouseholdObject = {};
      const globalHouseholdMembers = [];
      globalHouseholdObject.globalHouseholdId = window.location.href.split('/')[4];
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
          optionArray.relationshipToHeadOfHousehold = $(item).find('.relationshiptohoh').val();
          optionArray.dateCreate = '';
          optionArray.dateUpdate = '';
          optionArray.userCreate = Meteor.userId();
          optionArray.userUpdate = Meteor.userId();
          optionArray.globalHouseHoldId = window.location.href.split('/')[4];
          globalHouseholdMembers.push(optionArray);
        }
      );
      Meteor.call('updateGlobalHousehold', globalHouseholdMembers,
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

Template.selectedClientRowEdit.events({
  'click .deleteMember'(evt) {
    $(`tr#${evt.target.id}`).remove();
  },
});
