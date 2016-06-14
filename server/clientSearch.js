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

			var localClients = clientInfo.aggregate(
				[
					{
						$project: {
							firstName: "$firstName",
							lastName: "$lastName",
							fullName: {
								$concat: [ "$firstName", " ", "$lastName" ]
							}
						}
					}, {
						$match: {
							fullName: new RegExp(query, "i")
						}
					}, {
						$sort: {
							firstName: 1
						}
					}
				]
			);

			var mergedClients = [];

			if ( localClients.length == 0 && hmisClients.length == 0 ) {
				mergedClients.push({firstName: "Create New", lastName: "Client", query: query, clientNotFound: true});
			} else {
				mergedClients = localClients.map(function ( client ) {
					client.isLocalClient = true;
					return client;
				}).concat(hmisClients);
			}

			return mergedClients;
		}
	}
);

