/**
 * Created by udit on 20/06/16.
 */

Template.searchClient.onRendered(
  () => {
    Meteor.typeahead.inject();
  }
);

Template.searchClient.events(
  {
    'click .search-btn'(event, template) {
      event.preventDefault();
      const fullname = template.find('input.typeahead.tt-input').value;
      if (fullname != null) {
        // console.log(fullname);
        const fnln = fullname.split('');
        const clientRecord = clientInfo.findOne({ firstName: fnln[0], lastName: fnln[1] });
        // console.log(clientRecord);
        if (clientRecord) {
          const clientID = clientRecord._id;
          // console.log(clientID);
          Router.go('viewClient', { _id: clientID });
        } else {
          // console.log('The entered name is not in the local MongoDB');
        }
      }
    },
    'click .client-search-icon-container': () => {
      $('#search-client-keyword').focus();
    },
  }
);
