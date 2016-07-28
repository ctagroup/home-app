/**
 * Created by udit on 20/06/16.
 */

Meteor.methods(
  {
    addClient(
      firstName,
      middleName,
      lastName,
      suffix,
      photo,
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
      relationship,
      location,
      shelter,
      signature
    ) {
      const clientInfoCollection = HomeUtils.adminCollectionObject('clientInfo');
      const clientRecords = clientInfoCollection.insert(
        {
          firstName,
          middleName,
          lastName,
          suffix,
          photo,
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
          relationship,
          location,
          shelter,
          signature,
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
      photo,
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
      relationship,
      location,
      shelter
    ) {
      const clientInfoCollection = HomeUtils.adminCollectionObject('clientInfo');
      clientInfoCollection.update(
        clientInfoID, {
          $set: {
            firstName,
            middleName,
            lastName,
            suffix,
            photo,
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
            relationship,
            location,
            shelter,
          },
        }
      );
    },
    removeClient(clientInfoID) {
      const questionCollection = HomeUtils.adminCollectionObject('clientInfo');
      questionCollection.remove({ _id: clientInfoID });
    },
    addClientToHMIS(clientID) {
      const clientInfoCollection = HomeUtils.adminCollectionObject('clientInfo');
      const client = clientInfoCollection.findOne({ _id: clientID });

      const personalId = HMISAPI.createClient(client);

      let flag = false;

      if (personalId) {
        clientInfoCollection.remove({ _id: client._id });
        const clientBasePath = HomeConfig.hmisAPIEndpoints.clientBaseUrl.replace(
          HomeConfig.hmisAPIEndpoints.apiBaseUrl,
          ''
        );
        const schemaVersion = HomeConfig.hmisAPIEndpoints.v2015;
        const clientsPath = HomeConfig.hmisAPIEndpoints.clients;
        const url = `${clientBasePath}${schemaVersion}${clientsPath}/${personalId}`;
        flag = {
          _id: personalId,
          link: url,
        };
      }
      return flag;
    },
    getHMISClient(clientId, apiUrl) {
      const client = HMISAPI.getClientFromUrl(apiUrl);
      const enrollments = HMISAPI.getEnrollments(clientId);
      client.enrollments = enrollments;
      return client;
    },
    getEnrollments(clientId) {
      const enrollments = HMISAPI.getEnrollments(clientId);
      return enrollments;
    },
  }
);
