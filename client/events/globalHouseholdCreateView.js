/**
 * Created by Anush-PC on 8/1/2016.
 */
Template.globalHouseholdCreateView.onRendered(
  () => {
    Meteor.typeahead.inject();
  }
);

Template.globalHouseholdCreateView.events(
  {
    'click .search-btn'(event, template) {
      event.preventDefault();
      const fullname = template.find('input.typeahead.tt-input').value;
      if (fullname != null) {
        // console.log(fullname);
        const fnln = fullname.split('');
        const clientRecord = clients.findOne({ firstName: fnln[0], lastName: fnln[1] });
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
