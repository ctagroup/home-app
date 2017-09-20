import { logger } from '/imports/utils/logger';
import { PendingClients } from '/imports/api/pendingClients/pendingClients';
import { HmisClient } from '/imports/api/hmisApi';

Meteor.methods({
  updateClient(clientId, client, schema = 'v2015') {
    const hc = HmisClient.create(Meteor.userId());
    hc.api('client').updateClient(clientId, client, schema);
    return client;
  },

  removeClient(clientId) { // eslint-disable-line
    // should we remove client from hmis to pending collection?
    throw new Meteor.Error('500', 'Removing client is not yet implemented');
    // Clients.remove({ _id: clientId });
  },

  updateClientMatchStatus(clientId, statusCode, comments, recipients) {
    const hc = HmisClient.create(Meteor.userId());
    return hc.api('house-matching').updateClientMatchStatus(
      clientId, statusCode, comments, recipients
    );
  },

  searchClient(query, options) {
    logger.info(`METHOD[${Meteor.userId()}]: searchClient(${query})`);
    const optionz = options || {};

    // guard against client-side DOS: hard limit to 50
    if (optionz.limit) {
      optionz.limit = Math.min(50, Math.abs(optionz.limit));
    } else {
      optionz.limit = 50;
    }

    const hc = HmisClient.create(Meteor.userId());
    let hmisClients = hc.api('client').searchClient(query, optionz.limit);

    hmisClients = hmisClients.filter(client => client.link);

    let localClients = [];
    if (!optionz.excludeLocalClients) {
      localClients = PendingClients.aggregate(
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
});
