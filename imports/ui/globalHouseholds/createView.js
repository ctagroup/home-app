/**
 * Created by Anush-PC on 8/1/2016.
 */
Template.globalHouseholdCreateView.events(
  {
    'click .createHousehold': (evt) => {
      evt.preventDefault();
      const headOfHouseholdId = $('input[name=ishoh]:checked').val();
      if (!headOfHouseholdId) {
        Bert.alert('You must pick up a Head of Household.', 'danger', 'growl-top-right');
        return;
      }
      const user = users.findOne({ _id: Meteor.userId() });
      const globalHouseholdObject = {
        // globalHouseholdId: null,
        headOfHouseholdId,
        inactive: $('input[name=inactive]:checked').val(),
        // dateCreated: '',
        // dateUpdated: '',
        userCreate: user.services.HMIS.accountId,
        userUpdate: user.services.HMIS.accountId,
      };
      const globalHouseholdMembers = [];
      $('.globalHouseholdMembers').find('tr').each(
        (i, item) => {
          if ($('input[name=ishoh]:checked').val() !== $(item).find('.clientID').text()) {
            const optionArray = {
              // houseHoldMembershipId: '',
              globalClientId: $(item).find('.clientID').text(),
              // dateCreated: '',
              // dateUpdated: '',
              // userCreate: user.services.HMIS.accountId,
              // userUpdate: user.services.HMIS.accountId,
              relationshipToHeadOfHousehold: $(item).find('.relationshiptohoh').val(),
              // globalHouseholdId: '',
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
            Router.go('adminDashboardglobalHouseholdsEdit', { _id: result.globalHouseholdId });
          }
        });
    },
    'click .cancelCreateHousehold'() {
      history.back();
    },
  }
);
