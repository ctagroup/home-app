const getEnrollmentIds = (hc, clientId, schema) =>
  hc.api('client').getClientEnrollments(clientId, schema)
    .map(({ id }) => ({
      enrollmentId: id,
      clientId,
      source: schema.slice(1),
    }));

export const getClientGlobalEnrollment = (hc, client) => {
  const { dedupClientId, clientVersions } = client;
  const globalEnrollments = hc.api('global').getClientEnrollments(dedupClientId);
  if (globalEnrollments[0]) return globalEnrollments[0];

  // Create enrollment if none:
  let enrollments;
  if (clientVersions) {
    // Merged Client
    enrollments = clientVersions
      .map(({ clientId, schema }) => getEnrollmentIds(hc, clientId, schema))
      .reduce((acc, val) => acc.concat(val), []); // flatten once
  } else {
    const { clientId, schema } = client;
    enrollments = getEnrollmentIds(hc, clientId, schema);
  }
  const globalEnrollment = hc.api('global').createGlobalEnrollment(dedupClientId, enrollments);
  return globalEnrollment;
};
