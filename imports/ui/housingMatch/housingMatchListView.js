import { TableDom } from '/imports/ui/dataTable/helpers';
import { logger } from '/imports/utils/logger';
import HousingMatch from '/imports/api/housingMatch/housingMatch';
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
      data: 'reservationId', // note: access nested data like this
      render(value, type, doc) {
        const client = doc.eligibleClients.clientDetails;

        let displayName = `${client.firstName} ${client.middleName} ${client.lastName}`;
        displayName = displayName.trim();

        if (!displayName) {
          displayName = doc.eligibleClients.clientId;
        }

        if (client.schema) {
          const url = Router.path(
            'viewClient',
            { _id: client.clientId },
            { query: `isHMISClient=true&schema=${client.schema}` }
          );
          return `<a href="${url}">${displayName}</a>`;
        }

        return displayName;
      },
    },
    {
      title: 'Housing Unit ID',
      data: 'housingUnitId',
      render(value, type, doc) {
        return `<a href="/housingUnits/${value}/edit">${doc.housingUnit.aliasName}</a>`;
      },
    },
    {
      title: 'Match Date',
      data: 'matchDate',
    },
    {
      title: 'User ID',
      data: 'userId',
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
      title: '',
      data: 'reservationId',
      render(value, type, doc) {
        const allStatus = doc.eligibleClients.referralStatus;
        if (allStatus.length > 0) {
          const lastStatus = allStatus[allStatus.length - 1];
          return generateStatusTagMarkup(lastStatus.status, lastStatus.dateUpdated);
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
    return () => HousingMatch.find().fetch();
  },
});

Template.housingMatchListView.events(
  {
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

      const reservation = HousingMatch.findOne({ reservationId });

      if (reservation) {
        let project = false;
        if (reservation.housingUnit) {
          project = reservation.housingUnit.project;
        }

        let recipients = [];
        if (project) {
          recipients = Users.find({ projectsLinked: project.projectId }).fetch();
          if (recipients.length > 0) {
            recipients = { toRecipients: recipients.map(item => item.emails[0].address) };
          }
        }

        Meteor.call(
          'updateClientMatchStatus',
          reservation.eligibleClients.clientId,
          // Agency Contact Status.
          1,
          'Notified from HOME App Matching List',
          recipients,
          (err, res) => {
            if (err) {
              logger.log(err);
            } else {
              logger.log(res);
              $(evt.currentTarget).parent().append(generateStatusTagMarkup(1));
              $(evt.currentTarget).remove();
            }
          }
        );
      }
    },
  }
);
