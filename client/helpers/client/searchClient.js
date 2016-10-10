/**
 * Created by udit on 07/04/16.
 */

Template.searchClient.helpers(
  {
    isGlobalHousehold() {
      const route = Router.current().location.get().path.split('/')[1];
      return route === 'globalHouseholds';
    },
    searchClient(query, sync, callback) {
      const options = {
        limit: 10,
      };

      const route = Router.current().location.get().path.split('/')[1];
      if (route === 'globalHouseholds') {
        options.excludeLocalClients = true;
      }

      Meteor.call(
        'searchClient', query, options, (err, res) => {
          if (err) {
            logger.log(err);
            return;
          }
          callback(
            res.map(
              (v) => {
                const vz = v;
                const fn = (vz && vz.firstName) ? vz.firstName.trim() : '';
                const mn = (vz && vz.middleName) ? vz.middleName.trim() : '';
                const ln = (vz && vz.lastName) ? vz.lastName.trim() : '';
                vz.value = `${fn} ${mn} ${ln}`;
                vz.value = vz.value.trim();
                return vz;
              }
            )
          );
        }
      );
    },
    clientSelected(event, dataObject) {
      const route = Router.current().location.get().path.split('/')[1];
      if (route === 'globalHouseholds') {
        if (dataObject.clientNotFound) {
          $('#search-client-keyword').val(dataObject.query).change();
        } else {
          const client = {};
          client.clientId = dataObject._id;
          client.clientName =
            `${dataObject.firstName} ${dataObject.middleName} ${dataObject.lastName}`;
          $('.globalHouseholdMembers').append(globalHouseholdsHelpers.generateMemberHtml(client));
        }
      } else {
        // NoOp Statement. Not going to be used anywhere.
        const temp = '';
        if (dataObject.clientNotFound) {
          $('#search-client-keyword').val(dataObject.query + temp).change();
          Router.go('adminDashboardclientsNew', {}, { query: `firstName=${dataObject.query}` });
        } else {
          const query = {};
          if (dataObject.isHMISClient) {
            query.query = `isHMISClient=true&schema=${dataObject.schema}`;
            Router.go('preliminarySurvey', { _id: dataObject._id }, query);
          }
          Router.go('viewClient', { _id: dataObject._id }, query);
        }
      }
    },
    getRecentClients() {
      return Session.get('recentClients') || [];
    },
    alertMessages() {
      const params = Router.current().params;
      if (params && params.query && params.query.deleted) {
        return '<p class="notice bg-success text-success">Client is removed successfully.</p>';
      }
      return '';
    },
  }
);
