/**
 * Created by udit on 07/04/16.
 */
Meteor.methods(
  {
    searchClient(query, options) {
			options = options || {};

			// guard against client-side DOS: hard limit to 50
			if (options.limit) {
				options.limit = Math.min(50, Math.abs(options.limit));
			} else {
				options.limit = 50;
			}

			let hmisClients = HMISAPI.searchClient(query, options.limit);

			let localClients = clientInfo.aggregate(
				[
					{
						$project: {
							firstName: "$firstName",
							middleName: "$middleName",
							lastName: "$lastName",
							fullName: {
								$concat: ["$firstName", " ", "$middleName", " ", "$lastName"]
							}
						}
					}, {
						$match: {
							fullName: new RegExp(query.split(' ').join('(.*)'), "i")
						},
					}, {
						$sort: {
							firstName: 1
						},
					},
				]
			);

			let mergedClients = [];

			if (localClients.length == 0 && hmisClients.length == 0) {
				mergedClients.push(
          {
            firstName: "Create New",
            lastName: "Client",
            query: query,
            clientNotFound: true,
          }
        );
			} else {
				mergedClients = localClients.map((client) => {
					client.isLocalClient = true;
					return client;
				}).concat(hmisClients.map((client) => {
					client._id = client.clientId;
					client.isHMISClient = true;
					return client;
				}));
			}

			return mergedClients;
		}
	}
);
