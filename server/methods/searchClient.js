/**
 * Created by udit on 07/04/16.
 */
Meteor.methods(
  {
    searchClient(query, options) {
      const optionz = options || {};

      logger.info(query);
      logger.info(optionz);

      // guard against client-side DOS: hard limit to 50
      if (optionz.limit) {
        optionz.limit = Math.min(50, Math.abs(optionz.limit));
      } else {
        optionz.limit = 50;
      }

      let hmisClients = HMISAPI.searchClient(query, optionz.limit);

      hmisClients = hmisClients.filter(client => client.link);

      let localClients = [];
      if (!optionz.excludeLocalClients) {
        localClients = clients.aggregate(
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
            },
            {
              $match: {
                fullName: new RegExp(query.split(' ').join('(.*)'), 'i'),
              },
            },
            {
              $sort: {
                firstName: 1,
              },
            },
            {
              $limit: optionz.limit,
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
      }

      let mergedClients = [];

      if (localClients.length === 0 && hmisClients.length === 0) {
        mergedClients.push(
          {
            firstName: 'Create New',
            lastName: 'Client',
            query,
            clientNotFound: true,
          }
        );
      } else {
        mergedClients = localClients.map(
          (client) => {
            const clientz = client;
            clientz.isLocalClient = true;
            return clientz;
          }
        ).concat(
          hmisClients.map(
            (client) => {
              const clientz = client;
              clientz._id = clientz.clientId;
              clientz.isHMISClient = true;

              clientz.schema = 'v2015';
              if (clientz.link.indexOf('v2014') !== -1) {
                clientz.schema = 'v2014';
              }

              return clientz;
            }
          )
        );
      }

      return mergedClients;
    },
  }
);
