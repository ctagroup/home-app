import moment from 'moment';

import { removeEmpty, getSchemaFromLink } from '/imports/api/utils';

const getVersions = (schemas) => _.map(schemas,
  (version) => ({ schema: version.schema, clientId: version.clientId }));

export const mergeClient = (clientVersionsList, schema) => {
  let sortedClientSchemas = _.map(clientVersionsList, (version) => {
    // assuming that link format is: '/hmis-clientapi/rest/{schema}/clients/{clientId}'
    const linkSchema = getSchemaFromLink(version.link);
    return Object.assign(removeEmpty(version), {
      schema: version.schema || linkSchema,
    });
  });
  sortedClientSchemas = _.sortBy(sortedClientSchemas, 'schema');
  const clientVersions = getVersions(sortedClientSchemas);
  if (schema) sortedClientSchemas.push({ schema });
  return Object.assign({ clientVersions }, ...sortedClientSchemas);
};

export const mergeClientExtended = (clientVersionsList, schema) => {
  let sortedClientSchemas = _.map(clientVersionsList, (version) => {
    // assuming that link format is: '/hmis-clientapi/rest/{schema}/clients/{clientId}'
    const linkSchema = getSchemaFromLink(version.link);
    const versionSchema = version.schema || linkSchema;
    const cleanVersion = removeEmpty(version);
    const moreData = _.map(cleanVersion, (v, k) =>
      ({ [`${k}::${versionSchema}::${version.clientId}`]: v }));
    return Object.assign(cleanVersion, {
      schema: version.schema || linkSchema,
    }, ...moreData);
  });

  sortedClientSchemas = _.sortBy(sortedClientSchemas, 'schema');
  const clientVersions = getVersions(sortedClientSchemas);
  if (schema) sortedClientSchemas.push({ schema });
  return Object.assign({ clientVersions }, ...sortedClientSchemas);
};

export const mergeByDedupId = (hmisClients) => {
  const groupedHMISClients = _.groupBy(hmisClients, 'dedupClientId');
  return _.map(_.values(groupedHMISClients), (clientSchemas) => {
    let sortedClientSchemas = _.sortBy(clientSchemas, 'schema');
    sortedClientSchemas = _.map(sortedClientSchemas, (client) => removeEmpty(client));
    const clientVersions = getVersions(sortedClientSchemas);
    return Object.assign({ clientVersions }, ...sortedClientSchemas);
  });
};

export const getClientVersion = (mergedClient, clientId, schema) => {
  const clientVersion = {};
  _.map(mergedClient, (v, k) => {
    const key = k.split('::');
    if (key.length === 3 && key[1] === schema && key[2] === clientId) {
      clientVersion[key[0]] = v;
    }
  });
  return clientVersion;
};

export const getEligibleClient = (hc, clientId) => {
  let eligibleClient;
  try {
    eligibleClient = hc.api('house-matching').getEligibleClient(clientId);
  } catch (e) {
    eligibleClient = { error: e.reason };
  }
  return eligibleClient;
};

export const getClientEnrollments = (hc, clientId, schema, stopFunction) => {
  const enrollments = hc.api('client').getClientEnrollments(clientId, schema);
  for (let i = 0; i < enrollments.length && !stopFunction; i += 1) {
    const exits = hc.api('client').getClientsEnrollmentExits(
      clientId, enrollments[i].enrollmentId, schema
    );
    enrollments[i].exits = exits.length ? exits[0] : false;
    enrollments[i].project = hc.api('client').getProject(enrollments[i].projectId, schema);
  }
  return enrollments;
};

export const getGlobalHouseholds = (hc, clientId, schema, stopFunction) => {
  const globalHouseholdMemberships = hc.api('global-household')
  .getGlobalHouseholdMemberships(clientId);

  const globalHouseholds = [];
  for (let i = 0; i < globalHouseholdMemberships.length && !stopFunction; i += 1) {
    const globalHousehold = hc.api('global-household').getHouseHold(
      globalHouseholdMemberships[i].globalHouseholdId
    );

    if (globalHousehold) {
      let hohSchema = 'v2015';
      if (globalHousehold.links[0].rel.indexOf('v2014') !== -1) {
        hohSchema = 'v2014';
      }

      globalHousehold.headOfHouseholdClient = hc.api('client').getClient(
        globalHousehold.headOfHouseholdId,
        hohSchema
      );
      globalHousehold.headOfHouseholdClient.schema = 'v2015';
      globalHousehold.userDetails = hc.api('user-service').getUser(
        globalHousehold.userId
      );

      globalHouseholds.push(globalHousehold);
    }
  }
  return globalHouseholds;
};

export const sortByTime = (history) => history.sort((a, b) => {
  const aTime = moment(a.dateUpdated, 'MM-DD-YYYY HH:mm:ss.SSS').unix();
  const bTime = moment(b.dateUpdated, 'MM-DD-YYYY HH:mm:ss.SSS').unix();
  return aTime - bTime;
});

export const getReferralStatusHistory = (hc, clientId) => {
  const referralStatusHistory = hc.api('house-matching').getReferralStatusHistory(clientId);
  // Sort based on Timestamp
  return sortByTime(referralStatusHistory);
};

export const getHousingMatch = (hc, clientId) => {
  const housingMatch = hc.api('house-matching').getHousingMatch(clientId);
  const housingUnit = hc.api('housing').getHousingUnit(housingMatch.housingUnitId);
  let projectSchema = 'v2015';
  if (housingUnit.links && housingUnit.links.length > 0
    && housingUnit.links[0].rel.indexOf('v2014') !== -1) {
    projectSchema = 'v2014';
  }
  housingUnit.project = hc.api('client').getProject(housingUnit.projectId, projectSchema);
  housingMatch.housingUnit = housingUnit;
  return housingMatch;
};
