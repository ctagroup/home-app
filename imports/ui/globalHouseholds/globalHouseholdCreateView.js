import Users from '/imports/api/users/users';
import './globalHouseholdMembers';
import './globalHouseholdCreateView.html';

Template.globalHouseholdCreateView.events(
  {
    'click .createHousehold': (evt) => {
      evt.preventDefault();
      const headOfHouseholdId = $('input[name=ishoh]:checked').val();
      if (!headOfHouseholdId) {
        Bert.alert('You must pick up a Head of Household.', 'danger', 'growl-top-right');
        return;
      }
      const user = Users.findOne({ _id: Meteor.userId() });
      const globalHouseholdObject = {
        headOfHouseholdId,
        inactive: $('input[name=inactive]:checked').val(),
        userCreate: user.services.HMIS.accountId,
        userUpdate: user.services.HMIS.accountId,
      };
      const globalHouseholdMembers = [];
      $('.globalHouseholdMembers').find('tr').each(
        (i, item) => {
          if ($('input[name=ishoh]:checked').val() !== $(item).find('.clientID').text()) {
            const optionArray = {
              globalClientId: $(item).find('.clientID').text(),
              relationshipToHeadOfHousehold: $(item).find('.relationshiptohoh').val(),
            };
            globalHouseholdMembers.push(optionArray);
          }
        }
      );
      Meteor.call('createGlobalHousehold', globalHouseholdMembers,
        globalHouseholdObject, (error, result) => {
          if (error) {
            Bert.alert(error.reason || error.error, 'danger', 'growl-top-right');
          } else {
            Bert.alert('New household created', 'success', 'growl-top-right');
            // TODO: redirect to a new household
            Router.go('adminDashboardglobalHouseholdsEdit', { _id: result.genericHouseholdId });
          }
        });
    },
    'click .cancelCreateHousehold'() {
      history.back();
    },
  }
);
