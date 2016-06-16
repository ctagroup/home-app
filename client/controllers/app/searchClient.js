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
					var fn = (v && v.firstName) ? v.firstName.trim() : '';
					var mn = (v && v.middleName) ? v.middleName.trim() : '';
					var ln = (v && v.lastName) ? v.lastName.trim() : '';
					v.value = fn + " " + mn + " " + ln;
					v.value = v.value.trim();
					return v;
				} ) );
			});
		},
		clientSelected: function (event, dataObject) {
			if ( dataObject.clientNotFound ) {
				$('#search-client-keyword').val(dataObject.query).change();
				Router.go('createClient', {}, { query : 'firstName='+dataObject.query } );
			} else {
				Router.go('viewClient', { _id: dataObject._id } );
			}
		},
		getRecentClients: function () {
			return Session.get("recentClients") || [];
		},
		alertMessages: function () {
			var params = Router.current().params;
			if ( params && params.query && params.query.deleted ) {
				return "<p class='notice bg-success text-success'>Client is removed successfully.</p>";
			}
		}
	}
);
