/**
 * Created by udit on 20/06/16.
 */

Template.searchClient.onRendered( function() {
	Meteor.typeahead.inject();
} );

Template.searchClient.events(
	{
		'click .search-btn': function(event, template){
			event.preventDefault();
			var fullname = template.find('input.typeahead.tt-input').value;
			console.log(fullname);
			if(fullname != null) {
				console.log(fullname);
				var fnln = fullname.split(" ");
				var clientRecord = clientInfo.findOne({firstName : fnln[0], lastName : fnln[1]});
				console.log(clientRecord);
				if(clientRecord){
					var clientID = clientRecord._id;
					console.log(clientID);
					Router.go('viewClient', {_id: clientID});
				} else{
					console.log("The entered name is not in the local MongoDB");
				}
			}
		}
	}
);
