/**
 * Created by udit on 08/04/16.
 */
var HMISAPI = {
	getAllClients: function( query ) {
		console.log(query);
		var regex = new RegExp("^" + query);
		return [{name:"John", lname: 'Doe'}];
	}
}
