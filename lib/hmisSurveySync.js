/**
 * Created by Mj on 15-Sep-16.
 */

hmisSurveySync = {
  addSurveyToHmis(surveyDetails, mongoSurveyId) {
    let tagVal = '';
    switch (surveyDetails.stype) {
      case 'spdat-s': tagVal = 'SINGLE_ADULT';
        break;
      case 'spdat-f': tagVal = 'FAMILY';
        break;
      case 'spdat-t': tagVal = 'YOUTH';
        break;
      default: tagVal = 'HUD';
    }
    Meteor.call(
      'creatingHMISSurvey', surveyDetails.title, Meteor.user().services.HMIS.accountId,
      tagVal, surveyDetails.locked, surveyDetails.copy, (error, result) => {
        if (error) {
          logger.error(`HMIS Survey Create: ${error}`);
        } else {
          // survey created successfully.
          Meteor.call('addSurveyApiId', mongoSurveyId, result.surveyId);
          // -------------------------------
          const sections = surveyFormatHelpers.getSections(mongoSurveyId);
          for (let i = 0; i < sections.length; i += 1) {
            const section = sections[i];
            Meteor.call('creatingHMISSection', result.surveyId, sections[i].content,
              sections[i].order, (erro, resu) => {    // eslint-disable-line
                if (erro) {
                  logger.error(`HMIS Section Create: ${erro}`);
                } else {
                  Meteor.call('addSectionMongoApiId', section._id, resu.surveySectionId);
                  const questionList = surveyFormatHelpers.getQuestionsPerSection(section._id);
                  logger.info(`Getting list - ${questionList.length}, ${section._id}`);
                  for (let j = 0; j < questionList.length; j += 1) {
                    const temp = questionList[j];
                    const question = questions.findOne({ _id: temp.content });
                    if (question.surveyServiceQuesId) {
                      Meteor.call(
                        'creatingQuestionMapping', result.surveyId, resu.surveySectionId,
                        typeof question.allowSkip === 'boolean' ? question.allowSkip :
                          temp.allowSkip,
                        question.surveyServiceQuesId, (err, res) => {
                          if (err) {
                            logger.error(`Question Mapping: ${err}`);
                          } else {
                            logger.info(`Create question Mapping: ${res}`);
                            Meteor.call('updateQuesIdInSqm', question._id,
                              question.surveyServiceQuesId);
                          }
                        });
                    } else {
                      logger.error(`Adding a question first - ${question._id}`);
                      // add question to HMIS first. Then put it in survey.
                      hmisQuesSync.addingQuestionToHmis(question, question._id, (quesWithId) => {
                        logger.info(`Updated Question: ${JSON.stringify(quesWithId)}`);
                        Meteor.call('creatingQuestionMapping', result.surveyId,
                          resu.surveySectionId, typeof question.allowSkip === 'boolean' ?
                            question.allowSkip : temp.allowSkip, quesWithId, (e, r) => {
                              if (e) {
                                logger.error(`Question Mapping: ${e}`);
                              } else {
                                logger.info(`Create question Mapping: ${r}`);
                                Meteor.call('updateQuesIdInSqm', question._id,
                                  quesWithId);
                              }
                            });
                      });
                    }
                  }
                }
              });
          }
        }
      });
  },
  updateSurveyToHmis(surveyDetails) {
    Meteor.call('updatingHmisSurvey', surveyDetails.apiSurveyServiceId, surveyDetails.title,
      Meteor.user().services.HMIS.accountId, surveyDetails.stype, surveyDetails.locked,
      surveyDetails.copy, (error, result) => {
        if (error) {
          logger.error(`HMIS Survey Update: ${error}`);
        } else {
          logger.info(`HMIS Survey Update Success: ${result}`);
        }
      });
    Meteor.call('getAllHmisSections', surveyDetails.apiSurveyServiceId, (error, result) => {
      if (error) {
        logger.error(`getAllHmisSections - ${error}`);
      } else {
        const sectionsFromMongo = surveyFormatHelpers.getSections(surveyDetails._id);
        for (let i = 0; i < result.length; i += 1) {
          const HmisSection = result[i];
          const section =
            surveyQuestionsMaster.findOne({ apiSurveyServiceId: HmisSection.surveySectionId });
          if (section) {
            // section found, update.
            // delete that object from sections.
            for (let j = sectionsFromMongo.length - 1; j >= 0; j -= 1) {
              const temp = sectionsFromMongo[j]._id;
              if (temp === section._id) sectionsFromMongo.splice(j, 1);
            }
            Meteor.call('updatingHmisSection', surveyDetails.apiSurveyServiceId,
              section.apiSurveyServiceId, section.content, section.order, (erro, resu) => {
                if (erro) {
                  logger.error(`updatingHmisSection - ${erro}`);
                } else {
                  logger.info(`updatingHmisSection - ${resu}`);
                  // Get and update all questions here.
                  Meteor.call('gettingQuesMapping', surveyDetails.apiSurveyServiceId,
                    section.apiSurveyServiceId, (err, res) => {
                      if (err) {
                        logger.error(`gettingQuesMapping - ${err}`);
                      } else {
                        logger.info(res);
                        // Delete all of them.
                        // On return of this function, add all questions in Mongo back again.
                        const MappingIds = [];
                        for (let m = 0; m < res.length; m += 1) {
                          MappingIds.push(res[m].question.questionId);
                        }
                        Meteor.call('deleteQuesMappings', surveyDetails.apiSurveyServiceId,
                          section.apiSurveyServiceId, MappingIds, (er, re) => {
                          // add all questions from Mongo back again.
                            if (er) {
                              logger.error(er);
                            } else {
                              logger.info(re);
                              const questionList =
                              surveyFormatHelpers.getQuestionsPerSection(section._id);
                              logger.info(`Getting list - ${questionList.length}, ${section._id}`);
                              for (let j = 0; j < questionList.length; j += 1) {
                                const temp = questionList[j];
                                const question = questions.findOne({ _id: temp.content });
                                if (question) {
                                  if (question.surveyServiceQuesId) {
                                    Meteor.call(
                                      'creatingQuestionMapping', surveyDetails.apiSurveyServiceId,
                                      section.apiSurveyServiceId,
                                      typeof question.allowSkip === 'boolean' ? question.allowSkip :
                                        temp.allowSkip,
                                      question.surveyServiceQuesId, (e, r) => {
                                        if (e) {
                                          logger.error(`Question Mapping: ${e}`);
                                        } else {
                                          logger.info(`Create question Mapping: ${r}`);
                                          Meteor.call('updateQuesIdInSqm', question._id,
                                            question.surveyServiceQuesId);
                                        }
                                      });
                                  } else {
                                    logger.error(`Adding question first - ${question._id}`);
                                    // add question to HMIS first. Then put it in survey.
                                    hmisQuesSync
                                      .addingQuestionToHmis(
                                        question,
                                        question._id,
                                        (quesWithId) => {
                                          logger.info(
                                            `Updated Ques: ${JSON.stringify(quesWithId)}`
                                          );
                                          Meteor.call('creatingQuestionMapping',
                                            surveyDetails.apiSurveyServiceId,
                                            section.apiSurveyServiceId,
                                            typeof question.allowSkip === 'boolean' ? question.allowSkip : temp.allowSkip, // eslint-disable-line
                                            quesWithId, (e, r) => {
                                              if (e) {
                                                logger.error(`Question Mapping: ${e}`);
                                              } else {
                                                logger.info(`Create question Mapping: ${r}`);
                                                Meteor.call('updateQuesIdInSqm', question._id,
                                                  quesWithId);
                                              }
                                            }
                                          );
                                        }
                                      );
                                  }
                                } else {
                                  logger.error(`DOES NOT EXIST - ${JSON.stringify(temp)} - ${j}`);
                                }
                              }
                            }
                          });
                      }
                    });
                }
              });
          } else {
            // not found, delete.
            for (let j = sectionsFromMongo.length - 1; j >= 0; j -= 1) {
              const temp = sectionsFromMongo[j]._id;
              if (temp === section._id) sectionsFromMongo.splice(j, 1);
            }
            Meteor.call('deleteHmisSection', result[i].surveySectionId, (erro, resu) => {
              if (erro) {
                logger.error(`deleteHmisSection - ${erro}`);
              } else {
                logger.info(resu);
              }
            });
          }
        }
        if (sectionsFromMongo.length > 0) {
          // add them one by one.
          for (let i = 0; i < sectionsFromMongo.length; i += 1) {
            const section = sectionsFromMongo[i];
            Meteor.call('creatingHMISSection', surveyDetails.apiSurveyServiceId,
              sectionsFromMongo[i].content, sectionsFromMongo[i].order,
              (erro, resu) => {    // eslint-disable-line
                if (erro) {
                  logger.error(`HMIS Section Create: ${erro}`);
                }
                if (resu) {
                  Meteor
                    .call('addSectionMongoApiId', section._id, resu.surveySectionId);
                  const questionList =
                    surveyFormatHelpers.getQuestionsPerSection(section._id);
                  logger.info(`Getting list - ${questionList.length}, ${section._id}`);
                  for (let j = 0; j < questionList.length; j += 1) {
                    const temp = questionList[j];
                    const question = questions.findOne({ _id: temp.content });
                    if (question.surveyServiceQuesId) {
                      Meteor.call(
                        'creatingQuestionMapping', surveyDetails.apiSurveyServiceId,
                        resu.surveySectionId, typeof question.allowSkip === 'boolean' ?
                          question.allowSkip : temp.allowSkip, question.surveyServiceQuesId,
                        (e, r) => {
                          if (e) {
                            logger.error(`Question Mapping: ${e}`);
                          } else {
                            logger.info(`Create question Mapping: ${r}`);
                            Meteor.call('updateQuesIdInSqm', question._id,
                              question.surveyServiceQuesId);
                          }
                        });
                    } else {
                      logger.error(`Adding question first - ${question._id}`);
                      // add question to HMIS first. Then put it in survey.
                      hmisQuesSync
                        .addingQuestionToHmis(question, question._id, (quesWithId) => {
                          logger.info(`Updated Question: ${JSON.stringify(quesWithId)}`);
                          Meteor.call(
                            'creatingQuestionMapping',
                            surveyDetails.apiSurveyServiceId,
                            resu.surveySectionId,
                            typeof question.allowSkip === 'boolean' ? question.allowSkip : temp.allowSkip, // eslint-disable-line
                            quesWithId, (e, r) => {
                              if (e) {
                                logger.error(`Question Mapping: ${e}`);
                              } else {
                                logger.info(`Create question Mapping: ${r}`);
                                Meteor.call('updateQuesIdInSqm', question._id,
                                  quesWithId);
                              }
                            }
                          );
                        }
                      );
                    }
                  }
                }
              });
          }
        }
      }
    });
  },
};
