HMISAPI = {



  getClient(clientId, schema = 'v2015', useCurrentUserObject = true) {
    // bylo
  },

  getClientFromUrl(apiUrl) {
  },
  searchClient(query, limit = 10, useCurrentUserObject = true) {
  },
  getEnrollmentsForPublish(clientId, schema = 'v2015', from = 0, limit = 30) {
    // getClientEnrollments
  },
  getEnrollmentExitsForPublish(clientId, enrollmentId, schema = 'v2015') {
    // getClientsEnrollmentExits
  },
  getHousingUnitsForPublish(page = 0, limit = 30) {
    // getHousingUnits - bylo
  },
  getHousingUnitForPublish(housingUnitId) {
    // getHousingUnit - bylo
  },
  createHousingUnit(housingUnitObject) {
    // bylo
  },
  updateHousingUnit(housingUnitObject) {
    // bylo
  },
  deleteHousingUnit(housingInventoryId) {
    // bylo
  },
  getGlobalHouseholdsForPublish(page = 0, limit = 30) {
    // getHouseholds - bylo
  },
  getSingleGlobalHouseholdForPublish(globalHouseholdId) {
    // getHousehold - bylo
  },
  getGlobalHouseholdMembershipsForPublish(clientId, page = 0, limit = 30) {
    // getGlobalHouseholdMemberships
  },
  getGlobalHouseholdMembersForPublish(globalHouseholdId, page = 0, limit = 30) {
    // getGlobalHouseholdMembers - bylo
  },
  postQuestionAnswer(category, data) {
    // jakie category????
  },
  getClients() {
    // bylo
  },
  createGlobalHousehold(globalHouseholdMembers, globalHouseholdObject) {
    // bylo
  },
  addMembersToHousehold(globalHouseholdID, globalHouseholdMem) {
    // bylo
  },
  deleteGlobalHousehold(globalHouseholdID) {
    // bylo
  },
  updateGlobalHousehold(globalHouseholdId, globalHouseholdObject) {
    // bylo
  },
  updateMembersToHousehold(globalHouseholdID, globalHouseholdMem) {
    // updateMembersOfHousehold, bylo
  },
  deleteMemberFromHousehold(globalHouseholdId, householdMembershipId) {
    // bylo
  },
  getProjectsForPublish(schemaVersion = 'v2015', from = 0, limit = 30) {
    // getProjects, bylo
  },
  getProjectForPublish(projectId, schemaVersion = 'v2015') {
    // getProject, bylo
  },
  createProjectSetup(projectName, projectCommonName, schemaVersion = 'v2015') {
  },
  getUserProfiles(from = 0, limit = 30) {
    // bylo
  },
  getRoles(from = 0, limit = 30) {
    // bylo
  },
  createSectionScores(surveyId, clientId, sectionId, sectionScore) {
  },
  createUser(userObj) {
  },
  updateUser(userId, userObj) {
    // bylo
  },
  changePassword(currentPassword, newPassword, confirmNewPassword) {
    // bylo
  },
  updateUserRoles(userId, rolesObj) {
    // bylo
  },
  deleteUserRole(userId, roleId) {
  },
  getUserForPublish(userId) {
    // getUser
  },
  createSurveyServiceQuestions(
    question, questionGroupId = '95bdca23-5135-4552-9f11-819cab1aaa45'
  ) {
    // createSurveyQuestion
  },
  updateSurveyServiceQuestion(
    question, questionId, questionGroupId = '95bdca23-5135-4552-9f11-819cab1aaa45'
  ) {
    // updateSurveyQuestion
  },
  getSurveyServiceQuestion(questionId, questionGroupId = '95bdca23-5135-4552-9f11-819cab1aaa45') {
    // getSurveyQuestion
  },
  deleteSurveyServiceQuestion(questionId, qGroupId = '95bdca23-5135-4552-9f11-819cab1aaa45') {
    // deleteSurveyQuestion
  },
  deletePickListGroup(pickListGroupId) {
  },
  createPickListGroup(pickListGroup) {
  },
  createPickListValues(pickListGroupId, pickListValues) {
  },
  createSurvey(survey) {
  },
  createSection(surveySection, surveyId) {
    // createSurveySection
  },
  createSurveyQuestionMappings(surveyId, sectionId, sectionQuestionMappings) {
  },
  updateHmisSurvey(surveyId, survey) {
    // updateSurvey
  },
  updateHmisSurveySection(surveySection, surveyId, sectionId) {
    // updateSurveySection

  },
  getHmisSurveySections(surveyId) {
    // getSurveySections
  },
  getHmisSurveyQuestionMappings(surveyId, sectionId) {
    // getSurveyQuestionMappings
  },
  deleteHmisSurveyQuestionMapping(surveyId, sectionId, questionId) {
    // deleteSurveyQuestionMapping
  },
  deleteHmisSurveySection(surveyId, sectionId) {
    // deleteSurveySection
  },
  deleteQuestionMappings(surveyId, sectionId, questionIds) {
  },
  addResponseToHmis(clientId, surveyId, responses) {
    // sendResponses
  },
  deleteSurveyScores(surveyId, clientId) {
    // deleteResponses

  },
  getEligibleClientsForPublish() {
    // getEligibleClients, bylo
  },
  getHousingMatchForPublish() {
    // getHousingMatches, bylo
  },
  getSingleHousingMatchForPublish(clientId) {
    // getHousingMatch
  },
  getReferralStatusHistory(clientId) {
    // bylo
  },
  postHousingMatch() {
  },
  postHousingMatchScores() {
  },
  updateClientMatchStatus(clientId, status, comments = '', recipients = []) {
  },
  getClientScore(clientId) {
    // bylo
  },
};
