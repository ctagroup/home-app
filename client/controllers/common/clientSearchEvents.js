/**
 * Created by kavyagautam on 5/20/16.
 */
Template.clientSearch.events({
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
			}
			else{
				console.log("The entered name is not in the local MongoDB");
			}
		}
	}
});

