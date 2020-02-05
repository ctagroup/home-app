import { logger } from '/imports/utils/logger';
import { HmisClient } from '/imports/api/hmisApi';
import { GlobalHouseholdsAccessRoles } from '/imports/config/permissions';
import eventPublisher, { UserEvent } from '/imports/api/eventLog/events';

Meteor.methods({
  createGlobalHousehold(globalHouseholdMembers, globalHouseholdObject) {
    logger.info(`METHOD[${this.userId}]: createGlobalHousehold`, globalHouseholdMembers, globalHouseholdObject); // eslint-disable-line max-len

    if (!Roles.userIsInRole(this.userId, GlobalHouseholdsAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    const hc = HmisClient.create(this.userId);
    const result = hc.api('global-household').createGlobalHousehold(
      globalHouseholdMembers,
      globalHouseholdObject
    );

    eventPublisher.publish(new UserEvent(
      'globalHouseholds.createGlobalHousehold',
      '',
      { userId: this.userId, globalHouseholdMembers, globalHouseholdObject }
    ));

    return result;
  },

  updateGlobalHousehold(householdId, oldMembers, newMembers, doc) {
    logger.info(`METHOD[${this.userId}]: updateGlobalHousehold`, householdId);

    check(householdId, String);
    if (!Roles.userIsInRole(this.userId, GlobalHouseholdsAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    const currentUser = Meteor.users.findOne(this.userId);
    const householdObject = Object.assign({}, doc, {
      // userCreate: globalHousehold.userCreate,
      userUpdate: currentUser.services.HMIS.accountId,
    });

    const hc = HmisClient.create(this.userId);
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

    eventPublisher.publish(new UserEvent(
      'globalHouseholds.updateGlobalHousehold',
      `${householdId}`,
      { userId: this.userId, oldMembers, newMembers, doc }
    ));
  },

  deleteHousehold(genericHouseholdId) {
    logger.info(`METHOD[${this.userId}]: deleteHousehold`, genericHouseholdId);

    check(genericHouseholdId, String);
    if (!Roles.userIsInRole(this.userId, GlobalHouseholdsAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    const hc = HmisClient.create(this.userId);
    const result = hc.api('global-household').deleteGlobalHousehold(genericHouseholdId);

    eventPublisher.publish(new UserEvent(
      'globalHouseholds.deleteHousehold',
      `${genericHouseholdId}`,
      { userId: this.userId }
    ));

    return result;
  },

});
