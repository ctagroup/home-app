/* eslint no-unused-vars: "off" */

class OAuthApi {
  renewAccessToken() {

  }

  getUserAccessToken() {

  }

  getCurrentAccessToken() {

  }
}

class HousingApi {
  createHousingUnit() {}
  updateHousingUnit() {}
  deleteHousingUnit() {}

  getHousingUnitsForPublish() {}
  getHousingUnitForPublish() {}
}

class GlobalHouseHoldsApi {
  createGlobalHousehold() {}
  updateGlobalHousehold() {}
  deleteGlobalHousehold() {}

  addMembersToHousehold() {}
  updateMembersToHousehold() {}
  deleteMemberFromHousehold() {}

  getGlobalHouseholdsForPublish() {}
  getSingleGlobalHouseholdForPublish() {}
  getGlobalHouseholdMembershipsForPublish() {}
  getGlobalHouseholdMembersForPublish() {}
}

class UserServiceApi {
  getProjectGroups() {}
  getUserProfiles() {}
  getRoles() {}
  createUser() {}
  updateUser() {}
  changePassword() {}
  updateUserRoles() {}
  deleteUserRole() {}
  getUserForPublish() {}
}

class SurveyServiceApi {
  createSectionScores() {}
  createSurveyServiceQuestions() {}
  updateSurveyServiceQuestion() {}
  getSurveyServiceQuestion() {}
  deleteSurveyServiceQuestion() {}
  deletePickListGroup() {}
  createPickListGroup() {}
  createPickListValues() {}
  createSurvey() {}
  createSection() {}
  createSurveyQuestionMappings() {}
  updateHmisSurvey() {}
  updateHmisSurveySection() {}
  getHmisSurveySections() {}
  getHmisSurveyQuestionMappings() {}
  deleteHmisSurveyQuestionMapping() {}
  deleteHmisSurveySection() {}
  deleteQuestionMappings() {}
  addResponseToHmis() {}
  deleteSurveyScores() {}
}

class HouseMatchingApi {
  getEligibleClientsForPublish() {}
  getHousingMatchForPublish() {}
  getSingleHousingMatchForPublish() {}
  getReferralStatusHistory() {}
  postHousingMatch() {}
  postHousingMatchScores() {}
  updateClientMatchStatus() {}
  getClientScore() {}
}
