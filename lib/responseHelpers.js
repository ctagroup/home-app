/**
 * Created by udit on 02/08/16.
 */

ResponseHelpers = {
  isSurveyCompleted(responseId) {
    let flag = false;

    if (Router.current().route.getName() === 'adminDashboardresponsesEdit') {
      const responseRecord = responses.findOne({ _id: responseId });

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
      surveyElements = surveyQuestionsMaster.find(
        {
          surveyID,
          sectionID: sid,
          contentType: 'question',
        }
      ).fetch();
    } else {
      surveyElements = surveyQuestionsMaster.find(
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

    const question = questions.findOne({ _id: qid });
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
    const responseSection = responses.findOne({ _id: Router.current().params._id });
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
            let responseVal = response[k].answer;
            const questionsList = questions.find(
              { _id: quesIDs }, { dataType: 1, _id: 0 }
            ).fetch();
            for (let i = 0; i < questionsList.length; i += 1) {
              const dataType = questionsList[i].dataType;
              if (dataType === 'Single Select') {
                const options = questionsList[i].options;
                for (let l = 0; l < options.length; l += 1) {
                  responseVal = options[l].description;
                  return responseVal;
                }
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
              } else {
                return responseVal;
              }
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
      const responseSection = responses.findOne({ _id: Router.current().params._id });

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
    const surveyDocument = surveyQuestionsMaster.find(
      { surveyID: tmpl.data.survey._id }
    ).fetch();
    const mainSectionObject = [];
    for (let i = 0; i < surveyDocument.length; i += 1) {
      const type = surveyDocument[i].contentType;
      if (type === 'section') {
        const sectionObject = {};
        const answerObject = [];
        const sectionQuestions = surveyQuestionsMaster.find(
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
                const question = questions.findOne({ _id: sectionQuestions[j].content });
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
                      alert(
                        /* eslint-disable */
                        `${surveyDocument[i].content} section is incomplete.Please fill all the fields in this section`
                        /* eslint-enable */
                      );
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
      const surveyCollection = HomeUtils.adminCollectionObject('surveys');
      const getSurvey = surveyCollection.findOne({ _id: tmpl.data.survey._id });
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
          break;
      }
      Meteor.call(
        'addSurveyResponse',
        tmpl.data.survey._id,
        client._id,
        client.isHMISClient,
        client.schema,
        Meteor.userId(),
        mainSectionObject,
        'Completed',
        (error, result) => {
          logger.log('Survey Saved completed!');
          if (error) {
            logger.log(error);
          } else {
            logger.log(result);
            // call function to add responses to HMIS.
            responseHmisHelpers.sendResponseToHmis(result, () => {
              // Abc
              // Send scores to HMIS here. If VI-SPDAT then only
              if (score !== 0) {
                const surveyDetails = surveys.findOne({ _id: tmpl.data.survey._id });
                Meteor.call(
                  'sendScoresToHMIS', surveyDetails.apiSurveyServiceId, client._id, score,
                  (err, res) => {
                    if (err) {
                      logger.log(err);
                    } else {
                      logger.log(res);
                    }
                  }
                );
              }
            });
          }
        }
      );
      alert('Survey Saved!');
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
            logger.log(error);
          } else {
            logger.log(result);
            const responseId = result;
            logger.log(`RID: ${responseId}`);
          }
        }
      );
      alert('Survey Paused!');
    }
    Router.go('adminDashboardresponsesView');
  },
  savePausedSurvey(status, tmpl) {
    const responseDocument = responses.findOne({ _id: tmpl.data.response._id });

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

    const surveyDocument = surveyQuestionsMaster.find({ surveyID }).fetch();
    const mainSectionObject = [];
    for (let i = 0; i < surveyDocument.length; i += 1) {
      const type = surveyDocument[i].contentType;
      if (type === 'section') {
        const sectionObject = {};
        const answerObject = [];
        const sectionQuestions = surveyQuestionsMaster.find(
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
                const question = questions.findOne({ _id: sectionQuestions[j].content });
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
                      alert(
                        /* eslint-disable */
                        `${surveyDocument[i].content} section is incomplete.Please fill all the fields in this section`
                        /* eslint-enable */
                      );
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
      const surveyCollection = HomeUtils.adminCollectionObject('surveys');
      const getSurvey = surveyCollection.findOne({ _id: surveyID });
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
          } else {
            logger.log(result);
            // call function to add responses to HMIS.
            // further if VI SPDAT, then save scores to HMIS too.
            // responseHmisHelpers.sendResponseToHmis(tmpl.data.response._id);
            responseHmisHelpers.sendResponseToHmis(tmpl.data.response._id, () => {
              // Abc
              // Send scores to HMIS here. If VI-SPDAT then only
              if (score !== 0) {
                const surveyDetails = surveys.findOne({ _id: surveyID });
                // Sending scores need to delete before that.
                Meteor.call('deleteOldScores', surveyDetails.apiSurveyServiceId, clientId,
                  (erro, resu) => {
                    if (erro) {
                      logger.error(`deleteOldScores - ${erro}`);
                    } else {
                      logger.info(`Success deleteOldScores - ${resu}`);
                      Meteor.call(
                        'sendScoresToHMIS', surveyDetails.apiSurveyServiceId, clientId, score,
                        (err, res) => {
                          if (err) {
                            logger.log(err);
                          } else {
                            logger.log(res);
                          }
                        }
                      );
                    }
                  });
              }
            });
          }
        }
      );
      alert('Survey Saved!');
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
      alert('Survey Paused!');
    }
    Router.go('adminDashboardresponsesView');
  },
};
