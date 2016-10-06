/**
 * Created by Anush-PC on 8/1/2016.
 */

Template.globalHouseholdEditView.events(
  {
    'click .updateHousehold': () => {
      const user = users.findOne({ _id: Meteor.userId() });
      const globalHouseholdId = Router.current().params._id;
      const globalHousehold = globalHouseholds.findOne({ _id: globalHouseholdId });
      const globalHouseholdObject = {
        globalHouseholdId,
        headOfHouseholdId: $('input[name=ishoh]:checked').val(),
        // dateCreated: '',
        // dateUpdated: '',
        userCreate: globalHousehold.userCreate,
        userUpdate: user.services.HMIS.accountId,
      };
      const newGlobalHouseholdMembers = [];
      $('.globalHouseholdMembers').find('tr').each(
        (i, item) => {
          const optionArray = {
            householdMembershipId: $(item).find('.householdMembershipId').val(),
            globalClientId: $(item).find('.clientID').text(),
            relationshipToHeadOfHousehold: $(item).find('.relationshiptohoh').val(),
            // dateCreate: '',
            // dateUpdate: '',
            // userCreate: '',
            // userUpdate: user.services.HMIS.accountId,
            globalHouseholdId,
          };
          newGlobalHouseholdMembers.push(optionArray);
        }
      );
      const oldGlobalHouseholdMembers = globalHousehold.clients;
      Meteor.call(
        'updateGlobalHousehold',
        globalHouseholdId,
        oldGlobalHouseholdMembers,
        newGlobalHouseholdMembers,
        globalHouseholdObject,
        (err, res) => {
          if (err) {
            logger.log(err);
          } else {
            logger.log(res);
          }
        }
      );
    },
  }
);
