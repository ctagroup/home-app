export const getClientGlobalEnrollments = (hc, dedupClientId, stopFunction) => {
  const globalEnrollments = hc.api('global').getClientEnrollments(dedupClientId);
  return globalEnrollments;
  // console.log('globalEnrollments', globalEnrollments, stopFunction);
  // console.log(globalEnrollments.message);

  // globalEnrollments.map(({ enrollments: { enrollments } }) => {
  // if (!stopFunction) {}
  //   return enrollments.map(enrollment => {
  //     hc.api('global').getClientEnrollment(dedupClientId, globalEnrollment);
  //   })
  // })
  // return enrollments;
};
