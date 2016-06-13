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

			var hmisClients = HMISAPI.searchClient(query, options.limit);

			var localClients = clientInfo.find(
				{
					$or: [
						{
							firstName : {
								$regex: new RegExp( query, "i" )
							}
						}, {
							lastName : {
								$regex: new RegExp( query, "i" )
							}
						}
					]
				}, {
					limit: options.limit,
					sort: {
						firstName: 1
					}
				}
			).fetch();

			var mergedClients = [];

			if ( localClients.length == 0 ) {
				mergedClients.push({firstName: "Create New", lastName: "Client", clientNotFound: true});
			} else {
				mergedClients = localClients.map(function ( client ) {
					client.isLocalClient = true;
					return client;
				}).concat(hmisClients);
			}

			console.log(mergedClients);

			return mergedClients;
		}
	}
);

