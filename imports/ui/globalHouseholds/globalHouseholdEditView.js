import GlobalHouseholds from '/imports/api/globalHouseholds/globalHouseholds';
import './globalHouseholdEditView.html';


Template.globalHouseholdEditView.helpers(
  {
    isActive(currentVal) {
      const globalHousehold = GlobalHouseholds.findOne({ _id: Router.current().params._id });
      if (globalHousehold && globalHousehold.inactive === currentVal) {
        return 'checked';
      }
      return '';
    },
  }
);

Template.globalHouseholdEditView.events(
  {
    'click .updateHousehold': (evt) => {
      evt.preventDefault();
      const headOfHouseholdId = $('input[name=ishoh]:checked').val();
      if (!headOfHouseholdId) {
        Bert.alert('You must pick up a Head of Household.', 'danger', 'growl-top-right');
        return;
      }
      const genericHouseholdId = Router.current().params._id;
      const globalHousehold = GlobalHouseholds.findOne({ _id: genericHouseholdId });
      const globalHouseholdObject = {
        genericHouseholdId,
        headOfHouseholdId,
        inactive: $('input[name=inactive]:checked').val(),
      };
      const newGlobalHouseholdMembers = [];
      $('.globalHouseholdMembers').find('tr').each(
        (i, item) => {
          const optionArray = {
            householdMembershipId: $(item).find('.householdMembershipId').val(),
            globalClientId: $(item).find('.clientID').text(),
            relationshipToHeadOfHousehold: $(item).find('.relationshiptohoh').val(),
            genericHouseholdId,
          };
          newGlobalHouseholdMembers.push(optionArray);
        }
      );
      const oldGlobalHouseholdMembers = globalHousehold.clients;
      Meteor.call(
        'updateGlobalHousehold',
        genericHouseholdId,
        oldGlobalHouseholdMembers,
        newGlobalHouseholdMembers,
        globalHouseholdObject,
        (err) => {
          if (err) {
            Bert.alert(err.reason || err.error, 'danger', 'growl-top-right');
          } else {
            Bert.alert('Household updated', 'success', 'growl-top-right');
          }
        }
      );
    },
    'click .cancelUpdateHousehold'() {
      history.back();
    },
  }
);
