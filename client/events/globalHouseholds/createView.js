/**
 * Created by Anush-PC on 8/1/2016.
 */
Template.globalHouseholdCreateView.events(
  {
    'click .createHousehold': () => {
      const user = users.findOne({ _id: Meteor.userId() });
      const globalHouseholdObject = {
        // globalHouseholdId: null,
        headOfHouseholdId: $('input[name=ishoh]:checked').val(),
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
        globalHouseholdObject, (err, res) => {
          if (err) {
            logger.log(err);
          } else {
            alert(res);
            // logger.log(res);
          }
        });
    },
  }
);
