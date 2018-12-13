/*

HMISAPI is no longer used, this file is left temporarly for reference

HMISAPI = {

  getClient(clientId, schema = 'v2015', useCurrentUserObject = true) {
    // present in 1.1
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
    // getHousingUnits - present in 1.1
  },
  getHousingUnitForPublish(housingUnitId) {
    // getHousingUnit - present in 1.1
  },
  createHousingUnit(housingUnitObject) {
    // present in 1.1
  },
  updateHousingUnit(housingUnitObject) {
    // present in 1.1
  },
  deleteHousingUnit(housingInventoryId) {
    // present in 1.1
  },
  getGlobalHouseholdsForPublish(page = 0, limit = 30) {
    // getHouseholds - present in 1.1
  },
  getSingleGlobalHouseholdForPublish(genericHouseholdId) {
    // getHousehold - present in 1.1
  },
  getGlobalHouseholdMembershipsForPublish(clientId, page = 0, limit = 30) {
    // getGlobalHouseholdMemberships
  },
  getGlobalHouseholdMembersForPublish(genericHouseholdId, page = 0, limit = 30) {
    // getGlobalHouseholdMembers - present in 1.1
  },
  postQuestionAnswer(category, data) {
    // jakie category????
  },
  getClients() {
    // present in 1.1
  },
  createGlobalHousehold(globalHouseholdMembers, globalHouseholdObject) {
    // present in 1.1
  },
  addMembersToHousehold(genericHouseholdId, globalHouseholdMem) {
    // present in 1.1
  },
  deleteGlobalHousehold(genericHouseholdId) {
    // present in 1.1
  },
  updateGlobalHousehold(genericHouseholdId, globalHouseholdObject) {
    // present in 1.1
  },
  updateMembersToHousehold(genericHouseholdId, globalHouseholdMem) {
    // updateMembersOfHousehold, present in 1.1
  },
  deleteMemberFromHousehold(genericHouseholdId, householdMembershipId) {
    // present in 1.1
  },
  getProjectsForPublish(schemaVersion = 'v2015', from = 0, limit = 30) {
    // getProjects, present in 1.1
  },
  getProjectForPublish(projectId, schemaVersion = 'v2015') {
    // getProject, present in 1.1
  },
  createProjectSetup(projectName, projectCommonName, schemaVersion = 'v2015') {
  },
  getUserProfiles(from = 0, limit = 30) {
    // present in 1.1
  },
  getRoles(from = 0, limit = 30) {
    // present in 1.1
  },
  createSectionScores(surveyId, clientId, sectionId, sectionScore) {
  },
  createUser(userObj) {
  },
  updateUser(userId, userObj) {
    // present in 1.1
  },
  changePassword(currentPassword, newPassword, confirmNewPassword) {
    // present in 1.1
  },
  updateUserRoles(userId, rolesObj) {
    // present in 1.1
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
    // getEligibleClients, present in 1.1
  },
  getHousingMatchForPublish() {
    // getHousingMatches, present in 1.1
  },
  getSingleHousingMatchForPublish(clientId) {
    // getHousingMatch
  },
  getReferralStatusHistory(clientId) {
    // present in 1.1
  },
  postHousingMatch() {
  },
  postHousingMatchScores() {
  },
  updateClientMatchStatus(clientId, status, comments = '', recipients = []) {
  },
  getClientScore(clientId) {
    // present in 1.1
  },
};
*/
