/**
 * Created by udit on 20/06/16.
 */

Meteor.methods(
	{
		getHMISClient: function ( clientId ) {
			var client = HMISAPI.getClient(clientId);
			return client;
		}
	}
);
