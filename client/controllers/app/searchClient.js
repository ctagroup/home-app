/**
 * Created by udit on 07/04/16.
 */
Template.searchClient.onRendered( function() {
	Meteor.typeahead.inject();
} );

Template.searchClient.helpers(
	{
		searchClient: function ( query, sync, callback ) {
			Meteor.call('searchClient', query, {}, function(err, res) {
				if (err) {
					console.log(err);
					return;
				}
				callback( res.map( function( v ) {
					v.value = v.firstName.trim() + ' ' + v.lastName.trim();
					return v;
				} ) );
			});
		},
		clientSelected: function (event, dataObject) {
			if ( dataObject.clientNotFound ) {
				console.log("create new client with "+dataObject.query.trim());
				$('#search-client-keyword').val(dataObject.query).change();
				Router.go('createClient', {}, { query : 'firstName='+dataObject.query } );
			} else {
				console.log("existing client");
				console.log(dataObject);
				Router.go('viewClient', { _id: dataObject._id } );
			}
		}
	}
);
