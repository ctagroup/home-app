import { logger } from '/imports/utils/logger';
import { HmisClient } from '/imports/api/hmis-api';

Meteor.methods({
  createGlobalHousehold(globalHouseholdMembers, globalHouseholdObject) {
    logger.info(`METHOD[${Meteor.userId()}]: createGlobalHousehold`, globalHouseholdMembers, globalHouseholdObject); // eslint-disable-line max-len
    const hc = HmisClient.create(Meteor.userId());
    return hc.api('global-household').createGlobalHousehold(
      globalHouseholdMembers,
      globalHouseholdObject
    );
  },

  updateGlobalHousehold(householdId, oldMembers, newMembers, householdObject) {
    logger.info(`METHOD[${Meteor.userId()}]: updateGlobalHousehold`, householdId);
    const hc = HmisClient.create(Meteor.userId());
    hc.api('global-household').updateGlobalHousehold(householdId, householdObject);

    const oldIds = oldMembers.map(item => item.globalClientId);
    const newIds = newMembers.map(item => item.globalClientId);
    const intersection = oldIds.filter(item => newIds.indexOf(item) !== -1);

    const membersToUpdate = [];
    for (let i = 0; i < oldMembers.length; i += 1) {
      if (intersection.indexOf(oldMembers[i].globalClientId) === -1) {
        hc.api('global-household').deleteMemberFromHousehold(
          householdId,
          oldMembers[i].householdMembershipId
        );
      } else {
        membersToUpdate.push(
          _.findWhere(
            newMembers,
            {
              globalClientId: oldMembers[i].globalClientId,
            }
          )
        );
        newIds.splice(newIds.indexOf(oldMembers[i].globalClientId), 1);
      }
    }

    if (membersToUpdate.length > 0) {
      hc.api('global-household').updateMembersOfHousehold(householdId, membersToUpdate);
    }

    const membersToAdd = [];
    for (let i = 0; i < newMembers.length; i += 1) {
      if (newIds.indexOf(newMembers[i].globalClientId) !== -1) {
        membersToAdd.push(newMembers[i]);
      }
    }

    if (membersToAdd.length > 0) {
      hc.api('global-household').addMembersToHousehold(householdId, membersToAdd);
    }
  },

  deleteHousehold(globalHouseholdId) {
    logger.info(`METHOD[${Meteor.userId()}]: deleteHousehold`, globalHouseholdId);
    const hc = HmisClient.create(Meteor.userId());
    return hc.api('global-household').deleteGlobalHousehold(globalHouseholdId);
  },

});
