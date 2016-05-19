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
					return { value: v.firstName.trim() + ' ' + v.lastName.trim() };
				} ) );
			});
		}
	}
);
