/**
 * Created by udit on 26/02/16.
 */
Schemas.adminSettings = new SimpleSchema({
	hmisAPI: {
		label: "HMIS API Settings",
		type: Object,
		optional: true,
	},
	"hmisAPI.trustedAppID": {
		label: "Trusted App ID",
		type: String,
		optional: true,
		max: 256
	}
});
