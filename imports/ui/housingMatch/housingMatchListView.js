import { TableDom } from '/imports/ui/dataTable/helpers';
import { logger } from '/imports/utils/logger';
import { fullName } from '/imports/api/utils';
import HousingMatch from '/imports/api/housingMatch/housingMatch';
import HousingUnits from '/imports/api/housingUnits/housingUnits';
import ReferralStatusList from '/imports/ui/clients/referralStatusList';
import Users from '/imports/api/users/users';
import './housingMatchListView.html';


function generateStatusTagMarkup(statusCode, timestamp = '') {
  const status = ReferralStatusList[statusCode];
  let timestampStr = '';
  if (timestamp) {
    timestampStr = `${timestamp} - `;
  }
  return `<span data-toggle="tooltip" title="${timestampStr}${status.desc}"
    class="js-tooltip label label-${status.cssClass}">${status.title}</span>`;
}

const tableOptions = {
  columns: [
    {
      title: 'Reservation ID',
      data: 'reservationId',
    },
    {
      title: 'Client',
      data: 'client', // note: access nested data like this
      render(value, type, doc) {
        const clientId = doc.eligibleClients.clientId;
        const clientDetails = doc.eligibleClients.clientDetails;
        if (clientDetails.loading) {
          return 'Loading...';
        }
        if (clientDetails.error) {
          return clientDetails.error;
        }
        const name = fullName(clientDetails) || clientId;
        if (clientDetails.schema) {
          const url = Router.path(
            'viewClient',
            { _id: clientId },
            { query: `schema=${clientDetails.schema}` }
          );
          return `<a href="${url}">${name}</a>`;
        }
        return name;
      },
    },
    {
      title: 'Housing Unit ID',
      data: 'housingUnitId',
      render(value, type, doc) {
        const aliasName = doc.housingUnit.aliasName || value;
        return `<a href="/housingUnits/${value}/edit">${aliasName}</a>`;
      },
    },
    {
      title: 'Match Date',
      data: 'matchDate',
    },
    {
      title: 'Match Status',
      data: 'eligibleClients', // note: access nested data like this
      render(value) {
        if (value.matched) {
          return 'Matched';
        }
        return 'Unmatched';
      },
    },
    {
      title: 'Ref',
      data: 'ref',
      render(value, type, doc) {
        const status = doc.eligibleClients.referralStatus;
        if (status.loading) {
          return 'Loading...';
        }
        if (status.error) {
          return status.error;
        }

        if (status.length > 0) {
          const last = status[status.length - 1];
          return generateStatusTagMarkup(last.status, last.dateUpdated);
        }
        return `<button
          class="btn btn-sm btn-default js-notify-agency-contact"
          data-reservation-id="${doc.reservationId}">Notify</button>`;
      },
    },
  ],
  dom: TableDom,
};

Template.housingMatchListView.helpers({
  hasData() {
    return HousingMatch.find().count() > 0;
  },
  tableOptions() {
    return tableOptions;
  },
  tableData() {
    return () => {
      const housingMatch = HousingMatch.find().fetch();
      return housingMatch.map(m => {
        const housingUnit = HousingUnits.findOne(m.housingUnitId);
        const aliasName = housingUnit ? housingUnit.aliasName : m.housingUnitId;
        return _.extend(m, {
          housingUnit: {
            aliasName,
          },
        });
      });
    };
  },
});

Template.housingMatchListView.events({
  'click .postHousingMatches': () => {
    Meteor.call('postHousingMatches', (error, result) => {
      if (error) {
        logger.error(`postHousingMatches - ${error}`);
      } else {
        logger.info(`postHousingMatches - ${result}`);
      }
    });
  },
  'click .js-notify-agency-contact': (evt) => {
    const reservationId = $(evt.currentTarget).data('reservation-id');
    const housingMatch = HousingMatch.findOne(reservationId);
    const housingUnit = housingMatch && HousingUnits.findOne(housingMatch.housingUnitId);

    if (housingUnit) {
      const projectId = housingUnit.projectId;
      const recipients = Users.find({ projectsLinked: projectId }).fetch();
      if (recipients.length > 0) {
        const data = { toRecipients: recipients.map(item => item.emails[0].address) };
        Meteor.call('clients.updateMatchStatus',
          housingMatch.eligibleClients.clientId,
          1, // Agency Contact Status.
          'Notified from HOME App Matching List',
          data,
          (err) => {
            if (err) {
              Bert.alert(err.reason || err.error, 'danger', 'growl-top-right');
            } else {
              Bert.alert('Notified', 'danger', 'growl-top-right');
              $(evt.currentTarget).parent().append(generateStatusTagMarkup(1));
              $(evt.currentTarget).remove();
            }
          }
        );
      } else {
        Bert.alert('Nobody to notify', 'warning', 'growl-top-right');
      }
    }
  },
});
