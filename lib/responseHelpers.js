import { logger } from '/imports/utils/logger';
import SurveyQuestionsMaster from '/imports/api/surveys/surveyQuestionsMaster';
import Surveys from '/imports/api/surveys/surveys';
import Questions from '/imports/api/questions/questions';
import Responses from '/imports/api/responses/responses';

ResponseHelpers = {
  isSurveyCompleted(responseId) {
    let flag = false;

    if (Router.current().route.getName() === 'adminDashboardresponsesEdit') {
      const responseRecord = Responses.findOne({ _id: responseId });

      if (responseRecord && responseRecord.responsestatus) {
        const status = responseRecord.responsestatus;
        if (status === 'Completed') {
          // $('.savePaused_survey').hide();
          // $('.pausePaused_survey').hide();
          // $('.cancelPaused_survey').hide();
          // $('#pauseSurvey').hide();
          flag = true;
        }
      }
    }

    return flag;
  },
  surveyContents(surveyElements, status) {
    const sectionID = [];
    for (let i = 0; i < surveyElements.length; i += 1) {
      if (surveyElements[i].contentType === 'section') {
        if (ResponseHelpers.checkSectionAudience(surveyElements[i]._id, status)) {
          sectionID.push(surveyElements[i]);
        }
      } else if (ResponseHelpers.checkSectionAudience(surveyElements[i].sectionID, status)) {
        sectionID.push(surveyElements[i]);
      }
    }
    return sectionID;
  },
  checkSectionAudience(sid, status) {
    const surveyID = (Router.current().route.getName() === 'previewSurvey')
      ? Router.current().params._id
      : Template.instance().data.survey._id;
    let surveyElements = null;
    if (status === null) {
      surveyElements = SurveyQuestionsMaster.find(
        {
          surveyID,
          sectionID: sid,
          contentType: 'question',
        }
      ).fetch();
    } else {
      surveyElements = SurveyQuestionsMaster.find(
        {
          surveyID: status,
          sectionID: sid,
          contentType: 'question',
        }
      ).fetch();
    }

    let count = 0;
    for (let i = 0; i < surveyElements.length; i += 1) {
      if (ResponseHelpers.checkAudience(surveyElements[i].content)) {
        count += 1;
      }
    }

    return count > 0;
  },
  checkAudience(qid) {
    let flag = false;

    const question = Questions.findOne({ _id: qid });
    if (question && question.audience) {
      const data = Template.instance().data;
      // Default age is 18. if age is not available then consider the client as adult.
      let age = 18;
      if (data.client && data.client.dob) {
        age = ResponseHelpers.getAge(parseInt(data.client.dob, 10));
      }

      switch (question.audience) {
        case 'onlyadults':
          if (age >= 18) {
            flag = true;
          }
          break;
        case 'everyone':
        default:
          flag = true;
          break;
      }
    }

    return flag;
  },
  getAge(dob) {
    const date = new Date(dob);
    const ageDifMs = Date.now() - date.getTime();
    const ageDate = new Date(ageDifMs); // miliseconds from epoch
    return (Math.abs(ageDate.getUTCFullYear() - 1970));
  },
  getText(id) {
    const responseSection = Responses.findOne({ _id: Router.current().params._id });
    if (!responseSection || !responseSection.section) {
      return '';
    }
    const sections = responseSection.section;
    for (let j = 0; j < sections.length; j += 1) {
      if (!sections[j].skip) {
        const response = sections[j].response;
        for (let k = 0; k < response.length; k += 1) {
          const quesIDs = response[k].questionID;
          if (id === quesIDs) {
            const responseVal = response[k].answer;
            const questionsList = Questions.find(
              { _id: quesIDs }, { dataType: 1, _id: 0 }
            ).fetch();
            for (let i = 0; i < questionsList.length; i += 1) {
              const dataType = questionsList[i].dataType;
              if (dataType === 'Single Select') {
                // const options = questionsList[i].options;
                // for (let l = 0; l < options.length; l += 1) {
                //   responseVal = options[l].description;
                // }
                return responseVal;
              } else if (dataType === 'Multiple Select') {
                const options = questionsList[i].options;
                let answer = '';
                for (let l = 0; l < options.length; l += 1) {
                  answer += `${options[l].description}|`;
                }
                return answer.split('|').join('<br />');
              } else if (dataType === 'Single Photo') {
                if (ResponseHelpers.isSurveyCompleted(Router.current().params._id)) {
                  return `<img class="survey-single-photo-img" src="${responseVal}" />`;
                }
                return responseVal;
              }
              return responseVal;
            }
          }
        }
      }
    }
    return '';
  },
  isSkipped(sectionID) {
    let status = false;
    if (Router.current().route.getName() === 'adminDashboardresponsesEdit') {
      const responseSection = Responses.findOne({ _id: Router.current().params._id });

      if (responseSection && responseSection.section) {
        for (let i = 0; i < responseSection.section.length; i += 1) {
          if (responseSection.section[i].sectionID === sectionID) {
            if (responseSection.section[i].skip) {
              status = true;
            }
          }
        }
      }
    }

    return status;
  },
  addOptions(question) {
    let optionsTag;
    const response = ResponseHelpers.getText(question);
    if (response !== '') {
      const resp = response.split('|');
      for (let i = 0; i < resp.length; i += 1) {
        const deleteID = `${question}${i}`;
        optionsTag = `<tr  id='${deleteID}' class='questionRow'>`;
        optionsTag += `<td>
          <input type='text' id='${question}.description' class='value description'
            value='${resp[i]}'/>
        </td>`;
        optionsTag += `<td><a id='delete.${deleteID}' class='btn btn-primary optionremove' >
          <span class='fa fa-remove'></span></a></td></tr>`;
        $(`#aoptions${question}`).append(optionsTag);
        $(`#aoptions${question}`).on(
          'click', 'a.optionremove', function remove() {
            const rowId = $(this).attr('id');
            const j = rowId.split('.');
            const i1 = `${j[1]}`;
            $(`#${i1}`).remove();
          }
        );
      }
    }
  },
  saveResponse(status, tmpl) {
    const surveyDocument = SurveyQuestionsMaster.find(
      { surveyID: tmpl.data.survey._id }
    ).fetch();
    const mainSectionObject = [];
    for (let i = 0; i < surveyDocument.length; i += 1) {
      const type = surveyDocument[i].contentType;
      if (type === 'section') {
        const sectionObject = {};
        const answerObject = [];
        const sectionQuestions = SurveyQuestionsMaster.find(
          { sectionID: surveyDocument[i]._id }
        ).fetch();
        if ($(`#${surveyDocument[i]._id}`).is(':checked')) {
          sectionObject.sectionID = surveyDocument[i]._id;
          sectionObject.name = surveyDocument[i].content;
          sectionObject.skip = true;
          mainSectionObject.push(sectionObject);
          continue; // eslint-disable-line
        } else {
          for (let j = 0; j < sectionQuestions.length; j += 1) {
            const stype = sectionQuestions[j].contentType;
            if (stype !== 'labels') {
              if (ResponseHelpers.checkAudience(sectionQuestions[j].content)) {
                const question = Questions.findOne({ _id: sectionQuestions[j].content });
                const questionObject = {};
                let answer = '';
                if ((question.dataType === 'Single Select') || (question.dataType === 'Boolean')) {
                  answer = $(`input:radio[name=${question._id}]:checked`).val();
                } else if (question.dataType === 'Multiple Select') {
                  $(`input:checkbox[name=${question._id}]:checked`).each(
                    (k, item) => {
                      answer += `${$(item).val()}|`;
                    }
                  );
                  answer = answer.substr(0, answer.length - 1);
                } else if (question.dataType === 'wysiwyg') {
                  if ($(`#${question._id}`).summernote('code') !== '<p><br></p>') {
                    answer = $(`#${question._id}`).summernote('code');
                  }
                } else if (question.dataType === 'mtv') {
                  let option;
                  option = '';
                  $(`#aoptions${question._id}`).find('tr').each((k, item) => {
                    if (option === '') {
                      option = $(item).find('.description').val();
                    } else {
                      const op = $(item).find('.description').val();
                      option += `|${$.trim(op)}`;
                    }
                  });
                  if (option !== '') {
                    answer = option;
                  }
                } else if (question.dataType === 'date') {
                  answer = $(`#${question._id} input`).val();
                } else if (question.dataType === 'label') {
                  answer = 'This answer should be ignored as it\'s just a label';
                } else {
                  answer = tmpl.find(`#${question._id}`).value;
                }
                if ((answer === null) || (answer === '') || (answer === undefined)) {
                  if (status === 'Submit') {
                    if (
                      $(`#${sectionQuestions[j].sectionID}`).is(':checked')
                        || question.allowSkip
                    ) {
                      questionObject.questionID = question._id;
                      questionObject.answer = answer;
                      answerObject.push(questionObject);
                    } else {
                      const message = `${surveyDocument[i].content} section is incomplete.Please fill all the fields in this section`; // eslint-disable-line max-len
                      Bert.alert(message, 'warning', 'growl-top-right');
                      return;
                    }
                  }
                } else {
                  questionObject.questionID = question._id;
                  questionObject.answer = answer;
                  answerObject.push(questionObject);
                }
              }
            }
          }
          if (answerObject.length !== 0) {
            sectionObject.sectionID = surveyDocument[i]._id;
            sectionObject.name = surveyDocument[i].content;
            sectionObject.skip = false;
            sectionObject.response = answerObject;
            mainSectionObject.push(sectionObject);
          }
        }
      }
    }
    if (status === 'Submit') {
      const getSurvey = Surveys.findOne({ _id: tmpl.data.survey._id });
      let score;      // eslint-disable-line
      const data = Template.instance().data;
      const client = data.client;
      switch (getSurvey.stype) {
        case 'spdat-t':
          score = spdatScoreHelpers.calcSpdatTayScore(tmpl.data.survey._id);
          break;
        case 'spdat-f':
          score = spdatScoreHelpers.calcSpdatFamilyScore(tmpl.data.survey._id);
          break;
        case 'spdat-s':
          score = spdatScoreHelpers.calcSpdatSingleScore(tmpl.data.survey._id);
          break;
        default:
          score = 0;
          // Should be other than VI-SPDAT.
          break;
      }
      Meteor.call('addSurveyResponse',
        tmpl.data.survey._id,
        client._id,
        client.isHMISClient,
        client.schema,
        Meteor.userId(),
        mainSectionObject,
        'Completed',
        (error, result) => {
          if (error) {
            Bert.alert(error.reason || error.error, 'danger', 'growl-top-right');
            logger.log(error);
          } else {
            logger.log(`Result: ${result}`);
            // call function to add responses to HMIS.
            // TODO check and send for HUD HMIS here.
            // Get all questions.
            // If matches any of the HUD endpoints, send to that API.
            // TODO also check if this client is there in HMIS or not.
            if (getSurvey.stype.match(/spdat/i)) {
              const responseToSend = {
                clientID: client._id,
                surveyID: tmpl.data.survey._id,
                section: mainSectionObject,
              };
              responseHmisHelpers.sendResponseToHmis(result, responseToSend, false, (e, resu) => {
                // Send scores to HMIS here. If VI-SPDAT then only
                logger.info(`SPDAT Survey: ${getSurvey.stype}`);
                const surveyDetails = Surveys.findOne({ _id: tmpl.data.survey._id });
                Meteor.call(
                  'sendScoresToHMIS', surveyDetails.apiSurveyServiceId, client._id, score,
                  (err, res) => {
                    if (err) {
                      logger.log(err);
                      Bert.alert(err.reason || err.error, 'danger', 'growl-top-right');
                    } else {
                      logger.log(res);
                      if (resu) {
                        Meteor.call('updateSubmissionIdForResponses', result, resu.submissionId);
                        Router.go('adminDashboardresponsesView');
                      }
                    }
                  }
                );
              });
            }
            Bert.alert('Survey Saved!', 'success', 'growl-top-right');
            Router.go('adminDashboardresponsesView');
          }
        }
      );
    } else if (status === 'Paused') {
      const data = Template.instance().data;
      const client = data.client;
      Meteor.call(
        'addSurveyResponse',
        tmpl.data.survey._id,
        client._id,
        client.isHMISClient,
        client.schema,
        Meteor.userId(),
        mainSectionObject,
        'Paused',
        (error, result) => {
          logger.log('Survey Paused completed!');
          if (error) {
            Bert.alert(error.reason || error.error, 'danger', 'growl-top-right');
            logger.log(error);
          } else {
            logger.log(result);
            const responseId = result;
            logger.log(`RID: ${responseId}`);
            Bert.alert('Survey Paused!', 'success', 'growl-top-right');
            Router.go('adminDashboardresponsesView');
          }
        }
      );
    }
  },
  savePausedSurvey(status, tmpl) {
    const responseDocument = Responses.findOne({ _id: tmpl.data.response._id });

    let surveyID = '';
    let clientId = '';
    let isHMISClient = false;
    let clientSchema = '';

    if (responseDocument && responseDocument.surveyID && responseDocument.clientID) {
      surveyID = responseDocument.surveyID;
      clientId = responseDocument.clientID;

      if (responseDocument.isHMISClient) {
        clientSchema = responseDocument.clientSchema;
        isHMISClient = responseDocument.isHMISClient;
      }
    }

    const surveyDocument = SurveyQuestionsMaster.find({ surveyID }).fetch();
    const mainSectionObject = [];
    for (let i = 0; i < surveyDocument.length; i += 1) {
      const type = surveyDocument[i].contentType;
      if (type === 'section') {
        const sectionObject = {};
        const answerObject = [];
        const sectionQuestions = SurveyQuestionsMaster.find(
          { sectionID: surveyDocument[i]._id }
        ).fetch();
        if ($(`#${surveyDocument[i]._id}`).is(':checked')) {
          sectionObject.sectionID = surveyDocument[i]._id;
          sectionObject.name = surveyDocument[i].content;
          sectionObject.skip = true;
          mainSectionObject.push(sectionObject);
          continue; // eslint-disable-line
        } else {
          for (let j = 0; j < sectionQuestions.length; j += 1) {
            const stype = sectionQuestions[j].contentType;
            if (stype !== 'labels') {
              if (ResponseHelpers.checkAudience(sectionQuestions[j].content)) {
                const question = Questions.findOne({ _id: sectionQuestions[j].content });
                const questionObject = {};
                let answer = '';
                if ((question.dataType === 'Single Select') || (question.dataType === 'Boolean')) {
                  answer = $(`input:radio[name=${question._id}]:checked`).val();
                } else if (question.dataType === 'Multiple Select') {
                  $(`input:checkbox[name=${question._id}]:checked`).each(
                    (k, item) => {
                      answer += `${$(item).val()}|`;
                    }
                  );
                  answer = answer.substr(0, answer.length - 1);
                } else if (question.dataType === 'wysiwyg') {
                  if ($(`#${question._id}`).summernote('code') !== '<p><br></p>') {
                    answer = $(`#${question._id}`).summernote('code');
                  }
                } else if (question.dataType === 'date') {
                  answer = $(`#${question._id} input`).val();
                } else if (question.dataType === 'mtv') {
                  let option;
                  option = '';
                  $(`#aoptions${question._id}`).find('tr').each((k, item) => {
                    if (option === '') {
                      option = $(item).find('.description').val();
                    } else {
                      const op = $(item).find('.description').val();
                      option += `|${$.trim(op)}`;
                    }
                  });
                  if (option !== '') {
                    answer = option;
                  }
                } else if (question.dataType === 'label') {
                  answer = 'This answer should be ignored as it\'s just a label';
                } else {
                  answer = tmpl.find(`#${question._id}`).value;
                }

                if ((answer === null) || (answer === '') || (answer === undefined)) {
                  if (status === 'Pause_Submit') {
                    if (
                      $(`#${sectionQuestions[j].sectionID}`).is(':checked')
                        || question.allowSkip
                    ) {
                      questionObject.questionID = question._id;
                      questionObject.answer = answer;
                      answerObject.push(questionObject);
                    } else {
                      const msg = `${surveyDocument[i].content} section is incomplete. Please fill all the fields in this section`; // eslint-disable-line max-len
                      Bert.alert(msg, 'warning', 'growl-top-right');
                      return;
                    }
                  }
                } else {
                  questionObject.questionID = question._id;
                  questionObject.answer = answer;
                  answerObject.push(questionObject);
                }
              }
            }
          }
          if (answerObject.length !== 0) {
            sectionObject.sectionID = surveyDocument[i]._id;
            sectionObject.name = surveyDocument[i].content;
            sectionObject.skip = false;
            sectionObject.response = answerObject;
            mainSectionObject.push(sectionObject);
          }
        }
      }
    }
    if (status === 'Pause_Submit') {
      const getSurvey = Surveys.findOne({ _id: surveyID });
      logger.info(surveyID);
      let score;      // eslint-disable-line
      switch (getSurvey.stype) {
        case 'spdat-t':
          score = spdatScoreHelpers.calcSpdatTayScore(surveyID);
          break;
        case 'spdat-f':
          score = spdatScoreHelpers.calcSpdatFamilyScore(surveyID);
          break;
        case 'spdat-s':
          score = spdatScoreHelpers.calcSpdatSingleScore(surveyID);
          break;
        default:
          score = 0;
          break;
      }
      Meteor.call(
        'updateSurveyResponse',
        tmpl.data.response._id,
        surveyID,
        clientId,
        isHMISClient,
        clientSchema,
        Meteor.userId(),
        mainSectionObject,
        'Completed',
        (error, result) => {
          if (error) {
            logger.log(error);
            Bert.alert(error.reason || error.error, 'danger', 'growl-top-right');
          } else {
            logger.log(result);
            // call function to add responses to HMIS.
            // further if VI SPDAT, then save scores to HMIS too.
            const responseToSend = {
              clientID: clientId,
              surveyID,
              section: mainSectionObject,
            };
            responseHmisHelpers.sendResponseToHmis(tmpl.data.response._id, responseToSend, false,
              (e, resu) => {
                // Send scores to HMIS here. If VI-SPDAT then only
                logger.info(`SPDAT Survey: ${getSurvey.stype}`);
                const surveyDetails = Surveys.findOne({ _id: surveyID });
                Meteor.call(
                  'sendScoresToHMIS', surveyDetails.apiSurveyServiceId, clientId, score,
                  (err, res) => {
                    if (err) {
                      logger.log(err);
                    } else {
                      logger.log(res);
                      if (resu) {
                        Meteor.call('updateSubmissionIdForResponses', tmpl.data.response._id,
                          resu.submissionId);
                        Router.go('adminDashboardresponsesView');
                      }
                    }
                  }
                );
              }
            );
            Bert.alert('Survey Saved!', 'success', 'growl-top-right');
          }
        }
      );
    } else if (status === 'Pause_Paused') {
      Meteor.call(
        'updateSurveyResponse',
        tmpl.data.response._id,
        surveyID,
        clientId,
        isHMISClient,
        clientSchema,
        Meteor.userId(),
        mainSectionObject,
        'Paused',
        (error, result) => {
          if (error) {
            logger.log(error);
          } else {
            logger.log(result);
          }
        }
      );
      Bert.alert('Survey Paused!', 'success', 'growl-top-right');
    }
    Router.go('adminDashboardresponsesView');
  },
  removePausedSurvey(tmpl, callback) {
    Meteor.call('removeSurveyResponse', tmpl.data.response._id, (err, res) => {
      if (callback) {
        callback(err, res);
      }
    });
  },
};
