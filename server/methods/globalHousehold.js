/**
 * Created by Anush-PC on 8/1/2016.
 */


Meteor.methods(
  {
    updateGlobalHousehold(
      globalHouseholdId,
      oldGlobalHouseholdMembers,
      newGlobalHouseholdMembers,
      globalHouseholdObject) {
      const globalHousehold = HMISAPI.updateGlobalHousehold(
        globalHouseholdId,
        globalHouseholdObject
      );

      const oldIds = oldGlobalHouseholdMembers.map(item => item.globalClientId);

      const newIds = newGlobalHouseholdMembers.map(item => item.globalClientId);

      const intersection = oldIds.filter(item => newIds.indexOf(item) !== -1);

      const membersToUpdate = [];
      for (let i = 0; i < oldGlobalHouseholdMembers.length; i += 1) {
        if (intersection.indexOf(oldGlobalHouseholdMembers[i].globalClientId) === -1) {
          HMISAPI.deleteMemberFromHousehold(
            globalHouseholdId,
            oldGlobalHouseholdMembers[i].householdMembershipId
          );
        } else {
          membersToUpdate.push(
            _.findWhere(
              newGlobalHouseholdMembers,
              {
                globalClientId: oldGlobalHouseholdMembers[i].globalClientId,
              }
            )
          );
          newIds.splice(newIds.indexOf(oldGlobalHouseholdMembers[i].globalClientId), 1);
        }
      }

      if (membersToUpdate.length > 0) {
        HMISAPI.updateMembersToHousehold(globalHouseholdId, membersToUpdate);
      }

      const membersToAdd = [];
      for (let i = 0; i < newGlobalHouseholdMembers.length; i += 1) {
        if (newIds.indexOf(newGlobalHouseholdMembers[i].globalClientId) !== -1) {
          membersToAdd.push(newGlobalHouseholdMembers[i]);
        }
      }

      if (membersToAdd.length > 0) {
        HMISAPI.addMembersToHousehold(globalHouseholdId, membersToAdd);
      }

      return globalHousehold;
    },
    createGlobalHousehold(globalHouseholdMembers, globalHouseholdObject) {
      const hmisClients = HMISAPI.createGlobalHousehold(globalHouseholdMembers,
          globalHouseholdObject);
      return hmisClients;
    },
    deleteHousehold(globalHouseholdId) {
      const hmisClients = HMISAPI.deleteGlobalHousehold(globalHouseholdId);
      return hmisClients;
    },
    /*
    getClients() {
      const hmisClients = HMISAPI.getClients();
      const localClients = PendingClients.aggregate(
        [
          {
            $project: {
              firstName: '$firstName',
              middleName: '$middleName',
              lastName: '$lastName',
              personalId: '$personalId',
              fullName: {
                $concat: [
                  '$firstName',
                  ' ',
                  '$middleName',
                  ' ',
                  '$lastName',
                ],
              },
            },
          }, {
            $sort: {
              firstName: 1,
            },
          },
        ]
      );
      // Removing entries where we have data coming from HMIS.
      for (let i = localClients.length - 1; i >= 0; i -= 1) {
        for (let j = 0; j < hmisClients.length; j += 1) {
          if (localClients[i].personalId === hmisClients[j].clientId) {
                  // Remove.
            localClients.splice(i, 1);
            logger.info('Element Removed');
            break;
          }
        }
      }
      let mergedClients = [];

      if (!(localClients.length === 0 && hmisClients.length === 0)) {
        mergedClients = localClients.map(
          (client) => {
            const clientz = client;
            clientz.isHMISClient = false;
            return clientz;
          }
        ).concat(
          hmisClients.map(
            (client) => {
              const clientz = client;
              clientz._id = clientz.clientId;
              clientz.isHMISClient = true;
              return clientz;
            }
          )
        );
      }
      return mergedClients;
    },
    */
  }
);
