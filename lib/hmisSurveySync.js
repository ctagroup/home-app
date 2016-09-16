/**
 * Created by Mj on 15-Sep-16.
 */

hmisSurveySync = {
  addSurveyToHmis(surveyDetails, surveyID) {
    Meteor.call(
      'creatingHMISSurvey', surveyDetails.title, Meteor.user().services.HMIS.accountId,
      surveyDetails.stype, surveyDetails.locked, surveyDetails.copy, (error, result) => {
        if (error) {
          logger.error(`HMIS Survey Create: ${error}`);
        }
        if (result) {
          // survey created successfully.
          // -------------------------------
          Meteor.call('addSurveyApiId', surveyID, result.surveyId);
          // -------------------------------
          const sections = surveyFormatHelpers.getSections(surveyID);
          for (let i = 0; i < sections.length; i++) {
            Meteor.call('creatingHMISSection', result.surveyId, sections[i].content,
              sections[i].order, (erro, resu) => {    // eslint-disable-line
                if (erro) {
                  logger.error(`HMIS Section Create: ${erro}`);
                }
                if (resu) {
                  // -------------------------
                  Meteor.call('addSectionMongoApiId', sections[i]._id, resu.surveySectionId);
                  // -------------------------
                  const questionList = surveyFormatHelpers.getQuestionsPerSection(sections._id);
                  for (let j = 0; j < questionList.length; j++) {
                    const question = questions.findOne({ _id: questionList[j].content });
                    if (question.surveyServiceQuesId) {
                      Meteor.call(
                        'creatingQuestionMapping', result.surveyId, resu.surveySectionId,
                        typeof question.allowSkip === 'boolean' ? question.allowSkip :
                          questionList[j].allowSkip,
                        question.surveyServiceQuesId,
                        resu.surveySectionId, (err, res) => {
                          if (err) {
                            logger.error(`Question Mapping: ${err}`);
                          }
                          if (res) {
                            logger.info(`Create question Mapping: ${res}`);
                          }
                        });
                    } else {
                      // add question to HMIS first. Then put it in survey.
                      hmisQuesSync.addingQuestionToHmis(question, question._id, (er, re) => {
                        if (er) {
                          logger.error(`Error adding question to HMIS ${er}`);
                        } else {
                          const quesWithId = questions.findOne({ _id: question._id });
                          logger.info(`${re} Updated Quesiton: ${quesWithId}`);
                          Meteor.call('creatingQuestionMapping', result.surveyId,
                            typeof question.allowSkip === 'boolean' ?
                              question.allowSkip : questionList[j].allowSkip,
                            quesWithId.surveyServiceQuesId,
                            resu.surveySectionId, (e, r) => {
                              if (e) {
                                logger.error(`Question Mapping: ${e}`);
                              }
                              if (r) {
                                logger.info(`Create question Mapping: ${r}`);
                              }
                            });
                        }
                      });
                    }
                  }
                }
              });
          }
        }
      });
  },
  updateSurveyToHmis(surveyDetails, surveyID) {
    Meteor.call('updatingSurvey', surveyDetails.title, Meteor.user().services.HMIS.accountId,
      surveyDetails.stype, surveyDetails.locked, surveyDetails.copy, (error, result) => {
        if (error) {
          logger.error(`HMIS Survey Update: ${error}`);
        }
        if (result) {
          logger.info('HMIS Survey Update Success');
        }
      });
    const sections = surveyFormatHelpers.getSections(surveyID);
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].apiSurveyServiceId) {
        Meteor.call('updatingHMISSection', surveyDetails.apiSurveyServiceId,
          sections[i].content, sections[i].order, (error, result) => {
            if (error) {
              logger.error(error);
            } else {
              logger.info(`HMIS Section Update: ${result}`);
              // sync all question mappings.
              // get all question mappings first. then delete that are not there.
              // and add extra.
            }
          });
      } else {
        Meteor.call('creatingHMISSection', surveyDetails.apiSurveyServiceId,
          sections[i].content, sections[i].order, (error, result) => {
            if (error) {
              logger.error(error);
            } else {
              logger.info(result);
              // Saving resultant ID here in surveyQuestionMaster.
              // Add all question mappings.
              // ----------------------
              Meteor.call('addSectionMongoApiId', sections[i]._id, result.surveySectionId);
              // ----------------------
              const questionList = surveyFormatHelpers.getQuestionsPerSection(sections._id);
              for (let j = 0; j < questionList.length; j++) {
                const question = questions.findOne({ _id: questionList[j].content });
                if (question.surveyServiceQuesId) {
                  Meteor.call(
                    'creatingQuestionMapping', surveyDetails.apiSurveyServiceId,
                    result.surveySectionId, typeof question.allowSkip === 'boolean' ?
                      question.allowSkip : questionList[j].allowSkip,
                    question.surveyServiceQuesId, result.surveySectionId, (err, res) => {
                      if (err) {
                        logger.error(`Question Mapping: ${err}`);
                      }
                      if (res) {
                        logger.info(`Create question Mapping: ${res}`);
                      }
                    });
                } else {
                  // add question to HMIS first. Then put it in survey.
                  hmisQuesSync.addingQuestionToHmis(question, question._id, (errors, results) => {
                    const surveyServiceQuesId = results.questionId;
                    Meteor.call('creatingQuestionMapping', result.surveyId,
                      typeof question.allowSkip === 'boolean' ?
                        question.allowSkip : questionList[j].allowSkip,
                      surveyServiceQuesId, result.surveySectionId, (er, re) => {
                        if (er) {
                          logger.error(`Question Mapping: ${er}`);
                        }
                        if (re) {
                          logger.info(`Create question Mapping: ${re}`);
                        }
                      });
                  });
                }
              }
            }
          });
      }
    }
  },
};
