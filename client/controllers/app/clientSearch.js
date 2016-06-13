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
		clientSelected: function (event, value, datasetName) {
			console.log(event);
			console.log(value);
			console.log(datasetName);
		}
	}
);
