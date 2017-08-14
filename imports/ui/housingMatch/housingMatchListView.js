import { logger } from '/imports/utils/logger';
import HousingMatch from '/imports/api/housingMatch/housingMatch';
import './housingMatchListView.html';

Template.housingMatchListView.helpers({
  hasData() {
    console.log(HousingMatch.find().fetch(), 'xxx');
    return HousingMatch.find().count() > 0;
  },
  tableOptions() {
    return {
      columns: HomeConfig.collections.housingMatch.tableColumns,
      dom: HomeConfig.adminTablesDom,
    };
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

      const reservation = housingMatch.findOne({ reservationId });

      if (reservation) {
        let project = false;
        if (reservation.housingUnit) {
          project = reservation.housingUnit.project;
        }

        let recipients = [];
        if (project) {
          recipients = users.find({ projectsLinked: project.projectId }).fetch();

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
              $(evt.currentTarget).parent()
                .append(referralStatusHelpers.generateStatusTagMarkup(1));
              $(evt.currentTarget).remove();
            }
          }
        );
      }
    },
  }
);
