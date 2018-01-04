export function maxRank(surveyingId, type) {
  console.log('Not implemented', surveyingId, type); // eslint-disable-line no-console
  /*
  let newOrder;
  const surveyQuestionsMasterCollection = HomeUtils.adminCollectionObject('surveyQuestionsMaster');
  const lastSection = surveyQuestionsMasterCollection.findOne(
    { $and: [
      { surveyID: surveyingId },
      { contentType: 'section' },
    ] },
    { sort: { order: -1 } }
  );
  if (lastSection) {
    newOrder = lastSection.order + 1;
  } else {
    newOrder = 1;
  }
  if (type === 'question') {
    const lastQuestion = surveyQuestionsMasterCollection.findOne(
      { $and: [
        { surveyID: surveyingId },
        { sectionID: lastSection._id },
      ] },
      { sort: { order: -1 } }
    );
    if (lastQuestion) {
      newOrder = lastQuestion.order + 1;
    } else {
      newOrder = 1;
    }
  }
  return newOrder;
  */
}
