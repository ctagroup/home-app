/**
 * Created by udit on 07/04/16.
 */
Meteor.methods(
	{
		clientSearch: function ( query, options ) {
			options = options || {};

			// guard against client-side DOS: hard limit to 50
			if (options.limit) {
				options.limit = Math.min(50, Math.abs(options.limit));
			} else {
				options.limit = 50;
			}

			return HMISAPI.getAllClients(query);
		}
	}
);
