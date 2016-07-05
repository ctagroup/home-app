/**
 * Created by udit on 05/02/16.
 */
Meteor.methods(
  {
    getAllHomeRoles() {
      const homeRolesCollection = adminCollectionObject('homeRoles');
      return homeRolesCollection.find({}).fetch();
    },
    insertHomeRole(data) {
      const homeRolesCollection = adminCollectionObject('homeRoles');
      homeRolesCollection.insert(data);
    },
    generateDefaultHomeRoles() {
      const defaultHomeRoles = AdminConfig.defaultHomeRoles;
      for (let i = 0; i < defaultHomeRoles.length; i++) {
        Meteor.call('insertHomeRole', { title: defaultHomeRoles[i] });
      }
    },
    getAllHomePermissions() {
      return Roles.getAllRoles().fetch();
    },
    generateHomePermissions() {
      const defaultPermissions = AdminConfig.defaultPermissions;
      for (let i = 0; i < defaultPermissions.length; i++) {
        Roles.createRole(defaultPermissions[i]);
      }
    },
    getAllRolePermissions() {
      const rolePermissions = adminCollectionObject('rolePermissions');
      return rolePermissions.find({}).fetch();
    },
    generateHomeRolePermissions() {
      const defaultHomeRoles = AdminConfig.defaultHomeRoles;
      for (let i = 0; i < defaultHomeRoles.length; i++) {
        if (AdminConfig && AdminConfig.defaultRolePermissions
            && AdminConfig.defaultRolePermissions[defaultHomeRoles[i]]) {
          const rolePermissions = AdminConfig.defaultRolePermissions[defaultHomeRoles[i]];
          for (let j = 0; j < rolePermissions.length; j++) {
            const rolePermissionsCollection = adminCollectionObject('rolePermissions');
            rolePermissionsCollection.insert(
              {
                role: defaultHomeRoles[i],
                permission: rolePermissions[j],
                value: true,
              }
            );
          }
        }
      }
    },
    addUserToRole(userID, role) {
      const rolePermissionsCollection = adminCollectionObject('rolePermissions');
      let rolePermissions = rolePermissionsCollection.find({ role, value: true }).fetch();

      rolePermissions = _.map(
        rolePermissions, (permission) => permission.permission
      );

      if (rolePermissions && rolePermissions.length > 0) {
        Roles.addUsersToRoles(userID, rolePermissions, Roles.GLOBAL_GROUP);
      }
    },
    removeUserFromRole(userID, role) {
      const rolePermissionsCollection = adminCollectionObject('rolePermissions');
      let rolePermissions = rolePermissionsCollection.find({ role, value: true }).fetch();

      rolePermissions = _.map(
        rolePermissions, (permission) => permission.permission
      );

      rolePermissions = _.filter(
        rolePermissions, (permission) => {
          let userRoles = HomeHelpers.getUserRoles(userID);
          userRoles = _.filter(
            userRoles, (userRole) => {
              if (userRole === role) {
                return false;
              }
              return true;
            }
          );

          if (userRoles && userRoles.length > 0) {
            const otherRolesWithPermission = rolePermissionsCollection.find(
              {
                permission,
                role: { $in: userRoles },
                value: true,
              }
            ).fetch();
            if (otherRolesWithPermission.length > 0) {
              return false;
            }
          }

          return true;
        }
      );

      if (rolePermissions && rolePermissions.length > 0) {
        Roles.removeUsersFromRoles(userID, rolePermissions, Roles.GLOBAL_GROUP);
      }
    },
    updateRolePermissions(data) {
      const dataz = data;
      const rolePermissions = Meteor.call('getAllRolePermissions');
      const rolePermissionsCollection = adminCollectionObject('rolePermissions');

      for (let i = 0; i < rolePermissions.length; i++) {
        let flag = false;
        let last = false;
        for (let j = 0; j < dataz; j++) {
          if (dataz[j].name ===
              `rolePermissions[${rolePermissions[i].permission}][${rolePermissions[i].role}]`) {
            flag = j;
            break;
          }
          last = j;
        }

        if (flag) {
          rolePermissionsCollection.upsert(
            { role: rolePermissions[i].role, permission: rolePermissions[i].permission }, {
              $set: {
                role: rolePermissions[i].role,
                permission: rolePermissions[i].permission,
                value: true,
              },
            }
          );
          dataz[flag].processed = true;
        } else {
          rolePermissionsCollection.upsert(
            { role: rolePermissions[i].role, permission: rolePermissions[i].permission }, {
              $set: {
                role: rolePermissions[i].role,
                permission: rolePermissions[i].permission,
                value: false,
              },
            }
          );
          if (last) {
            dataz[last].processed = true;
          }
        }
      }

      for (let i = 0; i < dataz.length; i++) {
        if (! dataz[i].processed) {
          rolePermissionsCollection.upsert(
            { role: dataz[i].role, permission: dataz[i].permission }, {
              $set: {
                role: dataz[i].role,
                permission: dataz[i].permission,
                value: false,
              },
            }
          );
          dataz[i].processed = false;
        }
      }

      return dataz;
    },
    resetRolePermissions() {
      const rolePermissionsCollection = adminCollectionObject('rolePermissions');
      rolePermissionsCollection.remove({});
      Meteor.call('generateHomeRolePermissions');
    },
    saveAdminSettings(settings) {
      check(settings, Schemas.adminSettings);

      let value = '';
      if (typeof settings.hmisAPI !== 'undefined'
          && typeof settings.hmisAPI.trustedAppID !== 'undefined') {
        value = settings.hmisAPI.trustedAppID;
      }

      const optionsCollection = adminCollectionObject('options');
      optionsCollection.upsert(
        { option_name: 'trustedAppID' }, {
          $set: {
            option_name: 'trustedAppID',
            option_value: value,
          },
        }
      );

      value = '';
      if (typeof settings.hmisAPI !== 'undefined'
          && typeof settings.hmisAPI.trustedAppSecret !== 'undefined') {
        value = settings.hmisAPI.trustedAppSecret;
      }

      optionsCollection.upsert(
        { option_name: 'trustedAppSecret' }, {
          $set: {
            option_name: 'trustedAppSecret',
            option_value: value,
          },
        }
      );
    },
    adminRemoveDoc(collection, _id) {
// #		if Roles.userIsInRole this.userId, ['delete_'+collection]
      let val = '';
      if (collection === 'Users') {
        val = Meteor.users.remove({ _id });
      } else {
        // # global[collection].remove {_id:_id}
        val = adminCollectionObject(collection).remove({ _id });
      }
      return val;
    },
    addSurvey(title, active, copy, surveyCopyID, stype, created) {
      const surveyCollection = adminCollectionObject('surveys');
      const surveyID = surveyCollection.insert(
        {
          title,
          active,
          copy,
          surveyCopyID,
          stype,
          created,
        }
      );
      return surveyID;
    },
    updateSurvey(surveyID, title, stype, active) {
      const surveyCollection = adminCollectionObject('surveys');
      return surveyCollection.update(surveyID, { $set: { title, stype, active } });
    },
    updateCreatedSurvey(surveyID, created) {
      const surveyCollection = adminCollectionObject('surveys');
      surveyCollection.update(surveyID, { $set: { created } });
    },
    removeSurvey(surveyID) {
      const surveyCollection = adminCollectionObject('surveys');
      surveyCollection.remove({ _id: surveyID });
    },
    addQuestion(category, name, question, dataType, options, qtype, audience, locked, isCopy) {
      const questionCollection = adminCollectionObject('questions');
      questionCollection.insert(
        {
          category,
          name,
          question,
          options,
          dataType,
          qtype,
          audience,
          locked,
          isCopy,
        }
      );
    },
    updateQuestion(
      questionID,
      category,
      name,
      question,
      dataType,
      options,
      qtype,
      audience,
      locked,
      isCopy
    ) {
      const questionCollection = adminCollectionObject('questions');
      questionCollection.update(
        questionID, {
          $set: {
            category,
            name,
            question,
            options,
            dataType,
            qtype,
            audience,
            locked,
            isCopy,
          },
        }
      );
    },
    removeQuestion(questionID) {
      const questionCollection = adminCollectionObject('questions');
      questionCollection.remove({ _id: questionID });
    },
    addSurveyQuestionMaster(
      surveyTitle,
      surveyID,
      sectionID,
      allowSkip,
      contentType,
      content,
      order
    ) {
      const surveyQuestionsMasterCollection = adminCollectionObject('surveyQuestionsMaster');
      const surveyQues = surveyQuestionsMasterCollection.insert(
        {
          surveyTitle,
          surveyID,
          sectionID,
          allowSkip,
          contentType,
          content,
          order,
        }
      );
      return surveyQues;
    },
    updateSurveyQuestionMaster(_id, content) {
      const surveyQuestionsMasterCollection = adminCollectionObject('surveyQuestionsMaster');
      surveyQuestionsMasterCollection.update({ _id }, { $set: { content } });
    },
    updateSurveyQuestionMasterTitle(id, surveyTitle) {
      const surveyQuestionsMasterCollection = adminCollectionObject('surveyQuestionsMaster');
      return surveyQuestionsMasterCollection.update(
        { surveyID: id },
        { $set: { surveyTitle } }, { multi: true }
      );
    },
    removeSurveyQuestionMaster(id) {
      const surveyQuestionsMasterCollection = adminCollectionObject('surveyQuestionsMaster');

      const order = surveyQuestionsMasterCollection.findOne({ _id: id });

      const nextOrders = surveyQuestionsMasterCollection.find(
        {
          surveyID: order.surveyID,
          order: {
            $gt: order.order,
          },
        }
      ).fetch();

      for (let i = 0; i < nextOrders.length; i++) {
        surveyQuestionsMasterCollection.update(
          { _id: nextOrders[i]._id },
          { $set: { order: nextOrders[i].order - 1 } }
        );
      }

      return surveyQuestionsMasterCollection.remove({ _id: id });
    },
    resetSurveyQuestionMasterOrder(surveyId) {
      logger.info(surveyId);

      const surveyQuestionsMasterCollection = adminCollectionObject('surveyQuestionsMaster');
      const orders = surveyQuestionsMasterCollection.find(
        {
          surveyID: surveyId,
        }
      ).fetch();

      for (let i = 0; i < orders.length; i++) {
        surveyQuestionsMasterCollection.update(
          { _id: orders[i]._id },
          { $set: { order: i + 1 } }
        );
      }

      return true;
    },
    fixSurveyQuestionMasterOrder(surveyId) {
      logger.info(surveyId);

      const surveyQuestionsMasterCollection = adminCollectionObject('surveyQuestionsMaster');
      const orders = surveyQuestionsMasterCollection.find(
        {
          surveyID: surveyId,
        },
        {
          sort: {
            order: 1,
          },
        }
      ).fetch();

      for (let i = 0; i < orders.length; i++) {
        surveyQuestionsMasterCollection.update(
          { _id: orders[i]._id },
          { $set: { order: i + 1 } }
        );
      }
    },
    addClient(
      firstName,
      middleName,
      lastName,
      suffix,
      ssn,
      dob,
      race,
      ethnicity,
      gender,
      veteranStatus,
      disablingConditions,
      residencePrior,
      entryDate,
      exitDate,
      destination,
      householdId,
      relationship,
      location,
      shelter
    ) {
      const clientInfoCollection = adminCollectionObject('clientInfo');
      const clientRecords = clientInfoCollection.insert(
        {
          firstName,
          middleName,
          lastName,
          suffix,
          ssn,
          dob,
          race,
          ethnicity,
          gender,
          veteranStatus,
          disablingConditions,
          residencePrior,
          entryDate,
          exitDate,
          destination,
          householdId,
          relationship,
          location,
          shelter,
        }
      );
      return clientRecords;
    },
    updateClient(
      clientInfoID,
      firstName,
      middleName,
      lastName,
      suffix,
      ssn,
      dob,
      race,
      ethnicity,
      gender,
      veteranStatus,
      disablingConditions,
      residencePrior,
      entryDate,
      exitDate,
      destination,
      householdId,
      relationship,
      location,
      shelter
    ) {
      const clientInfoCollection = adminCollectionObject('clientInfo');
      clientInfoCollection.update(
        clientInfoID, {
          $set: {
            firstName,
            middleName,
            lastName,
            suffix,
            ssn,
            dob,
            race,
            ethnicity,
            gender,
            veteranStatus,
            disablingConditions,
            residencePrior,
            entryDate,
            exitDate,
            destination,
            householdId,
            relationship,
            location,
            shelter,
          },
        }
      );
    },
    removeClient(clientInfoID) {
      const questionCollection = adminCollectionObject('clientInfo');
      questionCollection.remove({ _id: clientInfoID });
    },
    removeSurveyCopyQuestionMaster(surveyCopyTitle) {
      const surveyQuestionsMasterCollection = adminCollectionObject('surveyQuestionsMaster');
      surveyQuestionsMasterCollection.remove({ surveyTitle: surveyCopyTitle });
    },
    addSurveyResponse(surveyID, clientID, audience, userID, mainSectionObject, status) {
      const responsesCollection = adminCollectionObject('responses');
      const responseRecords = responsesCollection.insert(
        {
          clientID,
          audience,
          surveyID,
          userID,
          responsestatus: status,
          section: mainSectionObject,
        }
      );
      return responseRecords;
    },
    updateSurveyResponse(responseID, surveyID, clientID, userID, mainSectionObject, status) {
      const responsesCollection = adminCollectionObject('responses');
      const responseRecords = responsesCollection.update(
        {
          _id: responseID,
        }, {
          $set: {
            clientID,
            surveyID,
            userID,
            responsestatus: status,
            section: mainSectionObject,
          },
        }
      );
      return responseRecords;
    },
    addClientToHMIS(clientID) {
      const clientInfoCollection = adminCollectionObject('clientInfo');
      const client = clientInfoCollection.findOne({ _id: clientID });

      const personalId = HMISAPI.createClient(client);

      let flag = false;

      if (personalId) {
        clientInfoCollection.update(
          {
            _id: client._id,
          }, {
            $set: {
              personalId,
            },
          }
        );
        flag = true;
      }
      return flag;
    },
  }
);
