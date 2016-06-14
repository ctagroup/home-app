/**
 * Created by udit on 07/04/16.
 */
Template.clientSearch.onRendered( function() {
	Meteor.typeahead.inject();
} );

Template.clientSearch.helpers(
	{
		clientSearch: function ( query, sync, callback ) {
			Meteor.call('clientSearch', query, {}, function(err, res) {
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
				$('#client-search-keyword').val(dataObject.query).change();
				Router.go('createClient', {}, { query : 'firstName='+dataObject.query } );
			} else {
				console.log("existing client");
				console.log(dataObject);
				Router.go('viewClient', { _id: dataObject._id } );
			}
		}
	}
);
