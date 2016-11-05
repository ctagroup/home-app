/**
 * Created by Mj on 10/8/2016.
 */

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

        let recepients = [];
        if (project) {
          recepients = users.find({ projectsLinked: project.projectId }).fetch();

          if (recepients.length > 0) {
            recepients = { toRecipients: recepients.map(item => item.emails[0].address) };
          }
        }

        Meteor.call(
          'updateClientMatchStatus',
          reservation.eligibleClients.clientId,
          // Agency Contact Status.
          1,
          'Notified from HOME App Matching List',
          recepients,
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
