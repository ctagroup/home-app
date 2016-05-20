/**
 * Created by udit on 05/02/16.
 */
Meteor.methods(
	{
		getAllHomeRoles: function() {
			var homeRolesCollection = adminCollectionObject("homeRoles");
			return homeRolesCollection.find({}).fetch();
		},
		insertHomeRole: function( data ) {
			var homeRolesCollection = adminCollectionObject("homeRoles");
			homeRoles.insert( data );
		},
		generateDefaultHomeRoles: function() {
			var defaultHomeRoles = AdminConfig.defaultHomeRoles;
			_.each(defaultHomeRoles, function ( item, i ) {
				Meteor.call("insertHomeRole", {title:item});
			});
		},
		getAllHomePermissions: function () {
			return Roles.getAllRoles().fetch();
		},
		generateHomePermissions: function () {
			var defaultPermissions = AdminConfig.defaultPermissions;
			_.each(defaultPermissions, function ( item, i ) {
				Roles.createRole(item);
			});
		},
		getAllRolePermissions: function () {
			var rolePermissions = adminCollectionObject("rolePermissions");
			return rolePermissions.find({}).fetch();
		},
		generateHomeRolePermissions: function () {
			var defaultHomeRoles = AdminConfig.defaultHomeRoles;
			_.each(defaultHomeRoles, function ( role, i ) {
				if(AdminConfig && AdminConfig.defaultRolePermissions && AdminConfig.defaultRolePermissions[role]) {
					var rolePermissions = AdminConfig.defaultRolePermissions[role];
					_.each(rolePermissions, function ( permission, i ) {
						var rolePermissionsCollection = adminCollectionObject("rolePermissions");
						rolePermissionsCollection.insert({role:role,permission:permission,value:true});
					});
				}
			});
		},
		addUserToRole: function ( userID, role ) {

			check(arguments, [Match.Any]);
			var rolePermissionsCollection = adminCollectionObject("rolePermissions");
			var rolePermissions = rolePermissionsCollection.find({role:role, value:true}).fetch();

			rolePermissions = _.map(rolePermissions, function ( permission ) {
				return permission.permission;
			});

			if(rolePermissions && rolePermissions.length > 0) {
				Roles.addUsersToRoles(userID, rolePermissions, Roles.GLOBAL_GROUP);
			}
		},
		removeUserFromRole: function ( userID, role ) {

			check(arguments, [Match.Any]);
			var rolePermissionsCollection = adminCollectionObject("rolePermissions");
			var rolePermissions = rolePermissionsCollection.find({role:role, value:true}).fetch();

			rolePermissions = _.map(rolePermissions, function ( permission ) {
				return permission.permission;
			});

			rolePermissions = _.filter(rolePermissions, function(permission) {

				var userRoles = HomeHelpers.getUserRoles(userID);
				userRoles = _.filter(userRoles, function ( userRole ) {
					if(userRole == role) {
						return false;
					}
					return true;
				});

				if ( userRoles && userRoles.length > 0 ) {
					otherRolesWithPermission = rolePermissionsCollection.find({permission:permission, role:{$in:userRoles}, value: true}).fetch();
					if(otherRolesWithPermission.length > 0) {
						return false;
					}
				}

				return true;
			});

			if(rolePermissions && rolePermissions.length > 0) {
				Roles.removeUsersFromRoles(userID, rolePermissions, Roles.GLOBAL_GROUP);
			}
		},
		updateRolePermissions: function(data) {
			var deletePermissions = new Array();
			var rolePermissions = Meteor.call("getAllRolePermissions");
			_.each(rolePermissions, function ( item, i ) {
				var flag = false;
				var last = false;
				for(rp in data) {
					if ( data[rp].name == "rolePermissions["+item.permission+"]["+item.role+"]" ) {
						flag = rp;
						break;
					}
					last = rp;
				}

				var rolePermissionsCollection = adminCollectionObject("rolePermissions");
				if (flag) {
					rolePermissionsCollection.upsert({role:item.role,permission:item.permission}, {$set:{role:item.role,permission:item.permission,value:true}});
					data[flag].processed = true;
				} else {
					rolePermissionsCollection.upsert({role:item.role,permission:item.permission}, {$set:{role:item.role,permission:item.permission,value:false}});
					if(last) {
						data[last].processed = true;
					}
				}
			});

			_.each(data, function(rp, i) {
				if ( ! rp.processed ) {
					rolePermissionsCollection.upsert({role:item.role,permission:item.permission}, {$set:{role:item.role,permission:item.permission,value:false}});
					rp.processed = false;
				}
			});

			return data;
		},
		resetRolePermissions: function () {
			var rolePermissionsCollection = adminCollectionObject("rolePermissions");
			rolePermissionsCollection.remove({});
			Meteor.call("generateHomeRolePermissions");
		},
		adminPublishRolesTable: function () {
			return;
			var collection = "roles", collectionObj = "rolesObj";
			Meteor.publishComposite("admin_tabular_roles", function(tableName, ids, fields) {
				var extraFields;
				check(tableName, String);
				check(ids, Array);
				check(fields, Match.Optional(Object));
				extraFields = _.reduce(collection.extraFields, function(fields, name) {
					fields[name] = 1;
					return fields;
				}, {});
				_.extend(fields, extraFields);
				this.unblock();
				return {
					find: function() {
						this.unblock();
						return collectionObj.find(
							{
								_id: {
									$in: ids
								}
					        }, {
								fields: fields
							}
						);
					},
					children: collection.children
				};
			});
		},
		saveAdminSettings: function(settings) {
			check(settings, Schemas.adminSettings);

			var value = "";
			if(typeof settings.hmisAPI != 'undefined' && typeof settings.hmisAPI.trustedAppID != 'undefined') {
				value = settings.hmisAPI.trustedAppID;
			}

			var optionsCollection = adminCollectionObject("options");
			optionsCollection.upsert({option_name:"trustedAppID"}, {$set: {option_name:"trustedAppID",option_value:value}});

			value = "";
			if(typeof settings.hmisAPI != 'undefined' && typeof settings.hmisAPI.trustedAppSecret != 'undefined') {
				value = settings.hmisAPI.trustedAppSecret;
			}

			optionsCollection.upsert({option_name:"trustedAppSecret"}, {$set: {option_name:"trustedAppSecret",option_value:value}});
		},
		addSurvey: function(title,active,copy,surveyCopyID,created){
			var surveyCollection = adminCollectionObject("surveys");
			var surveyID = surveyCollection.insert({title:title,active:active,copy:copy,surveyCopyID:surveyCopyID,created:created});
			return surveyID;
		},
		updateSurvey: function(surveyID, title,active){
			var surveyCollection = adminCollectionObject("surveys");
			surveyCollection.update(surveyID, {$set: {title:title,active:active}});
		},
		updateCreatedSurvey: function(surveyID,created){
			var surveyCollection = adminCollectionObject("surveys");
			surveyCollection.update(surveyID, {$set: {created:created}});
		},
		removeSurvey: function(surveyID){
			var surveyCollection = adminCollectionObject("surveys");
			surveyCollection.remove({_id:surveyID});
		},
		addQuestion: function(q_category,q_name,question,q_dataType,options,hud,locked,isCopy){
			var questionCollection = adminCollectionObject("questions");
			questionCollection.insert({category:q_category,name:q_name,question:question,options:options,dataType:q_dataType,hud:hud,locked:locked,isCopy:isCopy});
		},
		updateQuestion: function(questionID, q_category,q_name,question,q_dataType,options,hud,locked,isCopy){
			var questionCollection = adminCollectionObject("questions");
			questionCollection.update(questionID, {$set: {category:q_category,name:q_name,question:question,options:options,dataType:q_dataType,hud:hud,locked:locked,isCopy:isCopy}});
		},
		removeQuestion: function(questionID){
			var questionCollection = adminCollectionObject("questions");
			questionCollection.remove({_id:questionID});
		},
		addSurveyQuestionMaster: function(survey_title,survey_id,section_id,skip,content_type,content,rank) {
			var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");
			var surveyQues = surveyQuestionsMasterCollection.insert({surveyTitle:survey_title,surveyID:survey_id,sectionID:section_id,allowSkip:skip,contentType:content_type,content:content,order:rank});
			return surveyQues;
		},
		updateSurveyQuestionMaster: function(id, content) {
			var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");
			surveyQuestionsMasterCollection.update({_id:id}, {$set: {content: content}});
		},
		updateSurveyQuestionMasterTitle: function(id,survey_title){
			var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");
			surveyQuestionsMasterCollection.update({surveyID:id}, {$set: {surveyTitle:survey_title}},{multi:true});
		},
		removeSurveyQuestionMaster: function(id) {
			var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");
			surveyQuestionsMasterCollection.remove({_id:id});
		},
		addClient: function(first_name,middle_name,last_name,suffix,ssn,dob,race,ethnicity,gender,veteran_status,disabling_conditions,residence_prior,entry_date,exit_date,destination,personal_id,housing_id,relationship,loc,shelter){
			var clientInfoCollection = adminCollectionObject("clientInfo");
			var clientRecords = clientInfoCollection.insert({firstName:first_name,middleName:middle_name,lastName:last_name,suffix:suffix,ssn:ssn,dob:dob,race:race,ethnicity:ethnicity,gender:gender,veteran_status:veteran_status,disabling_conditions:disabling_conditions,residence_prior:residence_prior,entry_date:entry_date,exit_date:exit_date,destination:destination,personal_id:personal_id,housing_id:housing_id,relationship:relationship,location:loc,shelter:shelter});
			return clientRecords;
		},
		updateClient: function(clientInfoID,first_name,middle_name,last_name,suffix,ssn,dob,race,ethnicity,gender,veteran_status,disabling_conditions,residence_prior,entry_date,exit_date,destination,personal_id,housing_id,relationship,loc,shelter){
			var clientInfoCollection = adminCollectionObject("clientInfo");
			clientInfoCollection.update(clientInfoID, {$set: {firstName:first_name,middleName:middle_name,lastName:last_name,suffix:suffix,ssn:ssn,dob:dob,race:race,ethnicity:ethnicity,gender:gender,veteran_status:veteran_status,disabling_conditions:disabling_conditions,residence_prior:residence_prior,entry_date:entry_date,exit_date:exit_date,destination:destination,personal_id:personal_id,housing_id:housing_id,relationship:relationship,location:loc,shelter:shelter}});
		},
		removeClient: function(clientInfoID){
			var questionCollection = adminCollectionObject("clientInfo");
			questionCollection.remove({_id:clientInfoID});
		},
		removeSurveyCopyQuestionMaster:function(surveyCopyTitle){
			var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");
			surveyQuestionsMasterCollection.remove({surveyTitle:surveyCopyTitle});
		},
		addResponses: function(surveyID,clientID,userID,responseStatus){
			var responsesCollection = adminCollectionObject("responses");
			responsesCollection.insert({surveyID:surveyID,clientID:clientID,userID:userID,responseStatus:responseStatus});
		}
	}
);
