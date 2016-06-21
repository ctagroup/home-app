/**
 * Created by udit on 07/04/16.
 */
Meteor.methods(
  {
    searchClient(query, options) {
      const optionz = options || {};

      // guard against client-side DOS: hard limit to 50
      if (optionz.limit) {
        optionz.limit = Math.min(50, Math.abs(optionz.limit));
      } else {
        optionz.limit = 50;
      }

      const hmisClients = HMISAPI.searchClient(query, optionz.limit);

      const localClients = clientInfo.aggregate(
        [
          {
            $project: {
              firstName: '$firstName',
              middleName: '$middleName',
              lastName: '$lastName',
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
            $match: {
              fullName: new RegExp(query.split(' ').join('(.*)'), 'i'),
            },
          }, {
            $sort: {
              firstName: 1,
            },
          },
        ]
      );

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
              return clientz;
            }
          )
        );
      }

      return mergedClients;
    },
  }
);
