/**
 * Created by udit on 07/04/16.
 */

Template.searchClient.helpers(
  {
    forGlobalHousehold() {
      const route = Router.current().location.get().path.split('/')[1];
      let status = false;
      if (route === 'globalHousehold') {
        status = true;
      } else {
        status = false;
      }
      return status;
    },
    searchClient(query, sync, callback) {
      Meteor.call(
        'searchClient', query, { limit: 10 }, (err, res) => {
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
      if (route === 'globalHousehold') {
        if (dataObject.clientNotFound) {
          $('#search-client-keyword').val(dataObject.query).change();
          // Router.go('adminDashboardclientsNew', {}, { query: `firstName=${dataObject.query}` });
        } else {
          const query = {};
          if (dataObject.isHMISClient) {
            query.query = `isHMISClient=true&link=${encodeURIComponent(dataObject.link)}`;
          }
          const clientInfo = {};
          clientInfo.clientId = dataObject._id;
          clientInfo.clientName =
            `${dataObject.firstName} ${dataObject.middleName} ${dataObject.lastName}`;
          let clientDetails = Session.get('selectedClients');
          if ((clientDetails === undefined) || (clientDetails === null)) {
            clientDetails = [];
          }
          clientDetails.push(clientInfo);
          Session.set('selectedClients', clientDetails);
          // Router.go('viewClient', { _id: dataObject._id }, query);
        }
      } else {
        if (dataObject.clientNotFound) {
          $('#search-client-keyword').val(dataObject.query).change();
          Router.go('adminDashboardclientsNew', {}, { query: `firstName=${dataObject.query}` });
        } else {
          const query = {};
          if (dataObject.isHMISClient) {
            query.query = `isHMISClient=true&link=${encodeURIComponent(dataObject.link)}`;
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
