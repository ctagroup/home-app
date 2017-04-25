/**
 * Created by Mj on 15-Sep-16.
 */
import { logger } from '/imports/utils/logger';

hmisQuesSync = {
  addingQuestionToHmis(ques, mongoId, callback) {
    logger.error(JSON.stringify(ques));
    const question = hmisQuesSync.mongoToHmisFormatQuestion(ques);
    if (ques.dataType === 'Single Select' || ques.dataType === 'Multiple Select') {
      const pickListGroup = hmisQuesSync.mongoToHmisFormatPLG(ques.question);
      const pickListValues = hmisQuesSync.mongoToHmisFormatOptions(ques.options);
      Meteor.call(
        'addingPickListGroup', pickListGroup, (e, r) => {
          if (e) {
            logger.log(e);
          } else {
            logger.log(r);
            question.pickListGroupId = r.pickListGroupId;
            Meteor.call(
              'addingPickListValues', r.pickListGroupId, pickListValues, (er, re) => {
                if (er) {
                  logger.log(er);
                } else {
                  logger.info(re);
                  Meteor.call(
                    'addingQuestionSurveyService', question, (err, res) => {
                      if (err) {
                        logger.error(err);
                      }
                      const surveyServiceQuesId = res.questionId;
                      // Or save surveyServiceQuesId here only.
                      Meteor.call('putSurveyApiId', mongoId, surveyServiceQuesId, (erro, resu) => {
                        if (erro) {
                          logger.error(`putSurveyApiId: ${erro}`);
                        } else {
                          logger.info(`putSurveyApiId: ${resu}`);
                          callback(surveyServiceQuesId);
                        }
                      });
                    }
                  );
                }
              }
            );
          }
        }
      );
    } else {
      Meteor.call('addingQuestionSurveyService', question, (err, res) => {
        if (err) {
          logger.error(err);
        }
        const surveyServiceQuesId = res.questionId;
        logger.info(`Survey Question Id: ${JSON.stringify(surveyServiceQuesId)}`);
        Meteor.call('putSurveyApiId', mongoId, surveyServiceQuesId, (erro, resu) => {
          if (erro) {
            logger.error(`putSurveyApiId: ${erro}`);
          } else {
            logger.info(`putSurveyApiId: ${resu}`);
            callback(surveyServiceQuesId);
          }
        });
      });
    }
  },
  updatingQuesToHmis(ques) {
    const question = hmisQuesSync.mongoToHmisFormatQuestion(ques);
    Meteor.call('gettingQuestionDetails', ques.surveyServiceQuesId, (error, resul) => {
      if (error) {
        logger.info(error);
      } else {
        logger.info(resul);
        if (ques.dataType === 'Single Select' || ques.dataType === 'Multiple Select') {
          const pickListGroup = hmisQuesSync.mongoToHmisFormatPLG(ques.question);
          const pickListValues = hmisQuesSync.mongoToHmisFormatOptions(ques.options);
          Meteor.call('deleteOldPickListGroup', resul.pickListGroupId, (erro, resu) => {
            if (erro) {
              logger.error(`ERROR Pick List Group Delete: ${erro}`);
            } else {
              logger.info(`Pick List Group Delete: ${resu}`);
              // Create new PLG, get ID.
              Meteor.call('addingPickListGroup', pickListGroup, (err, res) => {
                if (err) {
                  logger.error(`ERROR Pick List Group Create: ${err}`);
                } else {
                  logger.info(`Pick List Group Create: ${JSON.stringify(res)}`);
                  question.pickListGroupId = res.pickListGroupId;
                  Meteor.call(
                    'addingPickListValues', res.pickListGroupId, pickListValues,
                    (er, re) => {
                      if (er) {
                        logger.error(`ERROR Pick List Values Add: ${er}`);
                      } else {
                        logger.info(`Pick List Values Add: ${re}`);
                        Meteor.call('updatingQuestionSurveyService',
                          question, ques.surveyServiceQuesId, (e, r) => {
                            if (e) {
                              logger.error(`ERROR Question Update: ${e}`);
                            } else {
                              logger.info(`Question Update: ${r}`);
                            }
                          });
                      }
                    }
                  );
                }
              });
            }
          });
        } else {
          logger.info(JSON.stringify(question));
          Meteor.call('updatingQuestionSurveyService', question, ques.surveyServiceQuesId,
            (e, r) => {
              if (e) {
                logger.error(`ERROR Question Update: ${e}`);
              } else {
                logger.info(`Question Update: ${r}`);
              }
            });
        }
      }
    });
  },
  mongoToHmisFormatQuestion(ques) {
    const correctValueForAssessment = null;
    const hudQuestion = (ques.qtype === 'hud');
    const questionWeight = 0;
    let questionDataType;
    let questionType;
    switch (ques.dataType) {
      case 'TextBox(Integer)':
        questionDataType = 'NUMBER'; break;
      case 'Boolean':
        questionDataType = 'BOOLEAN';
        break;
      default:
        questionDataType = 'STRING';
    }
    switch (ques.dataType) {
      case 'Multiple Select':
        questionType = 'CHECKBOX'; break;
      // case 'Boolean': Does not have a pick list assigned to it in implementation.
      case 'Single Select':
        questionType = 'RADIOBUTTON'; break;
      default:
        questionType = 'TEXT';
    }
    const questionDescription = ques.name;
    const displayText = ques.question;
    const copyQuestionId = ques.isCopy;
    const locked = ques.locked;
    const question = {
      questionDescription,
      displayText,
      questionDataType,
      questionType,
      correctValueForAssessment,
      copyQuestionId,
      hudQuestion,
      locked,
      questionWeight,
    };
    return question;
  },
  mongoToHmisFormatOptions(options) {
    const pickListValues = { pickListValues: [] };
    for (let k = 0; k < options.length; k += 1) {
      const temp = {};
      temp.pickListValueCode = options[k].value;
      temp.valueText = options[k].description;
      pickListValues.pickListValues.push(temp);
    }
    return pickListValues;
  },
  mongoToHmisFormatPLG(question) {
    const pickListGroupName = question.split(/\s+/).slice(1, 5).join(' ');
    const pickListGroup = { pickListGroupName };
    return pickListGroup;
  },
};
