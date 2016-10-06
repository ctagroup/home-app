/**
 * Created by Anush-PC on 8/1/2016.
 */

Meteor.methods(
  {
    updateGlobalHousehold(globalHouseholdId, globalHouseholdMembers, globalHouseholdObject) {
      const globalObject = globalHouseholdObject;
      const globalHousehold = HMISAPI.updateGlobalHousehold(
        globalHouseholdId,
        globalHouseholdMembers,
        globalObject
      );
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
    getClients() {
      const hmisClients = HMISAPI.getClients();
      const localClients = clients.aggregate(
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
  }
);
