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
			if(AdminConfig && AdminConfig.defaultRolePermissions && AdminConfig.defaultRolePermissions[role]) {
				var rolePermissions = AdminConfig.defaultRolePermissions[role];
				Roles.addUsersToRoles(userID, rolePermissions, Roles.GLOBAL_GROUP);
			}
		},
		removeUserFromRole: function ( userID, role ) {
			if(AdminConfig && AdminConfig.defaultRolePermissions && AdminConfig.defaultRolePermissions[role]) {
				var rolePermissions = AdminConfig.defaultRolePermissions[role];
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
		},
		addSurvey: function(title,active,skip,copy){
			var surveyCollection = adminCollectionObject("surveys");
			surveyCollection.insert({title:title,active:active,skip:skip,copy:copy});
		},
		updateSurvey: function(surveyID, title,active,skip,copy){
			var surveyCollection = adminCollectionObject("surveys");
			surveyCollection.update(surveyID, {$set: {title:title,active:active,skip:skip,copy:copy}});
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
		addSurveyQuestionMaster: function(survey_title,survey_id,content_type,content,rank) {
			var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");
			surveyQuestionsMasterCollection.insert({surveyID:survey_id,surveyTitle:survey_title,contentType:content_type,content:content,order:rank});
		},
		updateSurveyQuestionMaster: function(id, content) {
			var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");
			surveyQuestionsMasterCollection.update({_id:id}, {$set: {content: content}});
		},
		removeSurveyQuestionMaster: function(id) {
			var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");
			surveyQuestionsMasterCollection.remove({_id:id});
		}
	}
);
