/**
 * Created by udit on 10/02/16.
 */

// let surveyCopyId;
let surveyIDForCopy;
let surveyID;
let surveyTitle;
let masterSectionIDs;
// let originalSurveyId;
// let sectionComponentsID;
let originalSurveyUniqueIDs;
let surveyCopySectionID;
let surveyCopyTitle;

function resetSurveyModal() {
  $('#newSurveyModal input[type=text]').val('');
  $('#newSurveyModal input[type=checkbox]').attr('checked', false);
  $('#newSurveyModal input[type=checkbox]').prop('checked', false);

  $('.isCopyTrue').hide();
  $('.copyof_surveytitle').hide();
  $('.copy_active').hide();
  $('.survey_title').show();
  $('.active').show();
  $('#isUpdate').val('0');
  $('#surveyID').val('');
  $('.othersSpecify').hide();
}

function sectionComponents(originalSurveyComponentIDs, newSurveSectionIDs, newSurveyingID) {
  logger.log(`new survey ID: ${newSurveyingID}`);
  logger.log(`Sub sections: ${originalSurveyComponentIDs}`);
  logger.log(`new section ID: ${newSurveSectionIDs}`);

  const surveyQuestionsMasterCollection = HomeUtils.adminCollectionObject('surveyQuestionsMaster');
  const sectionComponent = surveyQuestionsMasterCollection.
    find({ _id: originalSurveyComponentIDs }).fetch();

  for (let i = 0; i < sectionComponent.length; i++) {
    surveyTitle = surveyCopyTitle;
    // const originalSurveyId = surveyIDForCopy;
    const surveyCopySkipValue = sectionComponent[i].allowSkip;
    const surveyCopyContentType = sectionComponent[i].contentType;
    const surveyCopyContent = sectionComponent[i].content;
    const surveyCopyRank = sectionComponent[i].order;

    Meteor.call(
            'addSurveyQuestionMaster',
            surveyTitle,
            newSurveyingID,
            newSurveSectionIDs,
            surveyCopySkipValue,
            surveyCopyContentType,
            surveyCopyContent,
            surveyCopyRank,
            (error, result) => {
              if (error) {
                logger.log(error);
              } else {
                logger.log(result);
              }
            }
        );
    resetSurveyModal();
  }
}

let compIDs;
function mainSection(mainSectionIDs, surveyingID) {
  const surveyQuestionsMasterCollection = HomeUtils.adminCollectionObject('surveyQuestionsMaster');
  const mainSections = surveyQuestionsMasterCollection.find({ _id: mainSectionIDs }).fetch();

  const componentsIDs = surveyQuestionsMasterCollection.
    find({ sectionID: mainSectionIDs }, { _id: 1 }).fetch();
  compIDs = [];

  const loopFunc = (error, result) => {
    if (error) {
      logger.log(error);
    } else {
      Session.set('SectionID', result);
      for (let j = 0; j < componentsIDs.length; j++) {
        compIDs[j] = componentsIDs[j]._id;
        sectionComponents(compIDs[j], Session.get('SectionID'), surveyingID);
      }
    }
  };
  for (let i = 0; i < mainSections.length; i++) {
    surveyTitle = surveyCopyTitle;
    // const originalSurveyId = surveyIDForCopy;
    const surveyCopySkipValue = mainSections[i].allowSkip;
    const surveyCopyContentType = mainSections[i].contentType;
    const surveyCopyContent = mainSections[i].content;
    const surveyCopyRank = mainSections[i].order;

    Meteor.call(
            'addSurveyQuestionMaster',
            surveyTitle,
            surveyingID,
            ' ',
            surveyCopySkipValue,
            surveyCopyContentType,
            surveyCopyContent,
            surveyCopyRank,
            loopFunc
        );
    resetSurveyModal();
  }
}

let newSurveyID;
function recordsForCopy(surveyingID) {
    // logger.log("new survey ID: " + surveyID);
  newSurveyID = surveyingID;
    // let sectionArray = new Array();

  const surveyQuestionsMasterCollection = HomeUtils.adminCollectionObject('surveyQuestionsMaster');
  const AllRecordsForCopy = surveyQuestionsMasterCollection.
    find({ surveyID: surveyIDForCopy }, { sectionID: 1 }).fetch();

  for (let i = 0; i < AllRecordsForCopy.length; i++) {
    originalSurveyUniqueIDs = AllRecordsForCopy[i]._id;
    surveyCopySectionID = AllRecordsForCopy[i].sectionID;

    if (surveyCopySectionID == null) {
      masterSectionIDs = originalSurveyUniqueIDs;
      mainSection(masterSectionIDs, newSurveyID);
    } else {
      // const sectionComponentsID = originalSurveyUniqueIDs;
    }
  }
}

Template.surveyForm.events(
  {
    'change .s_copy': (event) => {
      surveyIDForCopy = $(event.target).val();

      const surveyRecord = surveys.findOne({ _id: surveyIDForCopy });

      document.getElementById('copyof_surveytitle').value = surveyRecord.title;
      document.getElementById('copy_active').checked = surveyRecord.active;

      $('.s_copy').val('Choose');
    },
    'click .save': (evt, tmpl) => {
      const created = false;
      surveyID = $('#surveyID').val();
      const copy = tmpl.find('.copy').checked;
      const stype = tmpl.find('.s_type').value;

      let title = tmpl.find('.survey_title').value;
      let active = tmpl.find('.active').checked;

      if (copy) {
        title = tmpl.find('.copyof_surveytitle').value;
        surveyCopyTitle = title;

        active = tmpl.find('.copy_active').checked;
        // const surveyCopyId = $('#surveyID').val();
      }

      Meteor.call(
        'addSurvey', title, active, copy, surveyID, stype, created, (error, result) => {
          if (error) {
            logger.log(error);
          } else {
            if (result != null) {
              if (copy) {
                recordsForCopy(result);
              } else {
                logger.log(result);
              }
            }
          }
        }
      );

      resetSurveyModal();
    },
    'click .update': (evt, tmpl) => {
      surveyID = $('#surveyID').val();
      const copy = tmpl.find('.copy').checked;
      let title;
      let active;
      if (copy) {
        title = tmpl.find('.copyof_surveytitle').value;
        active = tmpl.find('.copy_active').checked;
      } else {
        title = tmpl.find('.survey_title').value;
        active = tmpl.find('.active').checked;
      }
      const stype = tmpl.find('.s_type').value;

      const isUpdate = $('#isUpdate').val();
      if (isUpdate === '1') {
        Meteor.call(
          'updateSurvey', surveyID, title, stype, active, (error, result) => {
            if (error) {
              logger.log(error);
            } else {
              logger.log(result);
            }
          }
        );
        Meteor.call(
          'updateSurveyQuestionMasterTitle', surveyID, title, (error, result) => {
            if (error) {
              logger.log(error);
            } else {
              logger.log(result);
            }
          }
        );
      }
      resetSurveyModal();
    },
    'click .cancel'() {
      resetSurveyModal();
    },
    'click .close'() {
      resetSurveyModal();
    },
    'click .copy'() {
      const copy = $('#copy').is(':checked');
      if (copy) {
        $('.isCopyTrue').show();
        $('.copyof_surveytitle').show();
        $('.copy_active').show();
        $('.survey_title').hide();
        $('.active').hide();
      } else {
        $('.isCopyTrue').hide();
        $('.copyof_surveytitle').hide();
        $('.copy_active').hide();
        $('.survey_title').show();
        $('.active').show();
      }
    },
    'click .remove'(/* evt, tmpl*/) {
      const surveyingID = $('#surveyID').val();
      Meteor.call(
        'removeSurvey', surveyingID, (error, result) => {
          if (error) {
            logger.log(error);
          } else {
            logger.log(result);
          }
        }
      );
      Meteor.call(
        'removeSurveyCopyQuestionMaster', surveyTitle, (error, result) => {
          if (error) {
            logger.log(error);
          } else {
            logger.log(result);
          }
        }
      );
      resetSurveyModal();
    },

  }
);

function resetQuestionModal() {
  $('#newQuestionModal input[type=text]').val('');
  $('#newQuestionModal #q_dataType').val('Textbox(String)').change();
  $('#newQuestionModal #q_type').val('hud').change();
  $('#newQuestionModal #q_audience').val('everyone').change();
  $('#newQuestionModal input[type=checkbox]').attr('checked', false);
  $('#newQuestionModal input[type=checkbox]').prop('checked', false);
  $('.isCopySet').hide();
  $('#isUpdate').val('0');
  $('#questionID').val('');
  $('#question').summernote('code', '');
}

function setFields(status) {
  $('#isCopy').attr('disabled', status);
  $('#q_copy').attr('disabled', status);
  $('#q_category').attr('disabled', status);
  $('#q_name').attr('disabled', status);
  $('#question').summernote(status ? 'disable' : 'enable');
  $('#hud').attr('disabled', status);
  $('#q_dataType').attr('disabled', status);
  if ((
        document.getElementById('q_dataType').value === 'Multiple Select'
      ) ||
      (
        document.getElementById('q_dataType').value === 'Single Select'
      )) {
    // $('#options').attr('disabled', status);
    $('#aoptions :input').attr('disabled', status);
    if (status === false) {
      $('.optionadd').unbind('click', false);
      $('.optionremove').unbind('click', false);
    } else {
      $('.optionadd').bind('click', false);
      $('.optionremove').bind('click', false);
    }
  }
}

function checkLocked() {
  const toggle = $('#locked').is(':checked');
  if (toggle) {
    setFields(true);
  } else {
    setFields(false);
  }
}

function maxRank(surveyingId, type) {
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
}

function registerDeleteOption() {
  $('#aoptions').on(
    'click', 'a.optionremove', () => {
      const rowId = $(this).attr('id');
      const i = rowId.split('.');
      const i1 = i[1];
      $(`#${i1}`).remove();
    }
  );
}

function populateOptions(question) {
  let $optionsTag;
  for (let i = 0; i < question.options.length; i++) {
    if (question.options[i].description != null) {
      $optionsTag = `<tr  id='${i}' class='questionRow'><td>
        <input type='text' id='${i}.value' class='value' value='${question.options[i].value}'/>
        </td>`;
      $optionsTag += `<td>
        <input type="text" id="${i}.description" class="description"
        value="${question.options[i].description}">
      </td>`;
      $optionsTag += `<td><a id='delete.${i}' class='btn btn-primary optionremove'>
        <span class='fa fa-remove'></span></a></td></tr>`;
      $('#aoptions').append($optionsTag);
      registerDeleteOption();
    }
  }
}

Template.surveyViewTemplate.events(
  {
    'click .addSurvey'(/* evt, tmpl*/) {
      resetSurveyModal();
      $('.copy').show();
      $('.copylabel').show();
      $('.showWhenEdit').hide();
      $('.showWhenNew').show();
    },
    'click .edit'(event) {
      const surveyCollection = HomeUtils.adminCollectionObject('surveys');
      const survey = surveyCollection.findOne({ _id: $(event.currentTarget).data('survey-id') });
      const copy = survey.copy;
      $('.copy').hide();
      $('.copylabel').hide();
      $('.isCopyTrue').hide();

      if (copy) {
        $('.copy').prop('checked', true);
        $('.copyof_surveytitle').show();
        $('.copy_active').show();
        $('.survey_title').hide();
        $('.active').hide();
      } else {
        $('.copy').prop('checked', false);
        $('.copyof_surveytitle').hide();
        $('.copy_active').hide();
        $('.survey_title').show();
        $('.active').show();
      }

      if (copy) {
        $('#newSurveyModal input[type=text]#copyof_surveytitle').val(survey.title);
        $('#newSurveyModal input[type=checkbox]#copy_active').attr('checked', survey.active);
        $('#newSurveyModal input[type=checkbox]#copy_active').prop('checked', survey.active);
      } else {
        $('#newSurveyModal input[type=text]#survey_title').val(survey.title);
        $('#newSurveyModal input[type=checkbox]#active').attr('checked', survey.active);
        $('#newSurveyModal input[type=checkbox]#active').prop('checked', survey.active);
        $('#newSurveyModal input[type=checkbox]#copy').attr('checked', survey.copy);
        $('#newSurveyModal input[type=checkbox]#copy').prop('checked', survey.copy);
      }
      $('#isUpdate').val('1');
      $('#surveyID').val($(event.currentTarget).data('survey-id'));

      $('.showWhenEdit').show();
      $('.showWhenNew').hide();
    },
  }
);

Template.questionViewTemplate.events(
  {
    'click .addQuestion'(/* evt, tmpl*/) {
      $('#aoptions').empty();
      resetQuestionModal();
      $('.showWhenEdit').hide();
      $('.showWhenNew').show();
      $('#isUploaded').val('');
      setFields(false);
    },
    'click .edit'(evt) {
      evt.preventDefault();
      $('#aoptions').empty();
      // let txt1;
      // let optionsTag;
      const questionsCollection = HomeUtils.adminCollectionObject('questions');
      const question = questionsCollection.findOne({ _id: $(evt.currentTarget).data('survey-id') });

      $('#q_category').val(question.category).change();
      $('#q_name').val(question.name);
      $('#question').summernote('code', question.question);
      $('#q_dataType').val(question.dataType).change();
      $('#q_type').val(question.qtype).change();
      $('#q_audience').val(question.audience).change();
      if (question.options != null) {
        // optionsTag = '';
        populateOptions(question);
      }

      $('#newQuestionModal input[type=checkbox]#isCopy').attr('checked', question.isCopy);
      $('#newQuestionModal input[type=checkbox]#isCopy').prop('checked', question.isCopy);
      $('#newQuestionModal input[type=checkbox]#locked').attr('checked', question.locked);
      $('#newQuestionModal input[type=checkbox]#locked').prop('checked', question.locked);

      $('#isUpdate').val('1');
      $('#isUploaded').val(question.surveyServiceQuesId).change();
      $('#questionID').val($(evt.currentTarget).data('survey-id'));

      $('.showWhenEdit').show();
      $('.showWhenNew').hide();
      if (question.locked) {
        setFields(true);
      } else {
        setFields(false);
      }
    },
  }
);

Template.questionForm.onRendered(() => {
  $('.js-summernote').summernote({
    minHeight: 100,
    fontNames: HomeConfig.fontFamilies,
  });
});

Template.questionForm.events(
  {
    'click .optionadd'(/* evt, tmpl*/) {
      let optionLength = $('#aoptions').children().length;
      let optionsTag;
      optionLength = optionLength + 1;
      optionsTag = `<tr  id='${optionLength}' class='questionRow'><td><input type='text' 
        id='${optionLength}.value' class='value' value=''/></td>`;

      optionsTag += `<td>
        <input type="text" id="${optionLength}.description" class="description" />
      </td>`;

      optionsTag += `<td><a id='delete.${optionLength}' class='btn btn-primary optionremove' >
        <span class='fa fa-remove'></span></a></td></tr>`;

      $('#aoptions').append(optionsTag);
      $('#aoptions').on(
        'click', 'a.optionremove', function remove() {
          const rowId = $(this).attr('id');
          const i = rowId.split('.');
          const i1 = i[1];
          $(`#${i1}`).remove();
        }
      );
    },
    'click .toggle'(/* evt, tmpl*/) {
      const isCopy = $('#isCopy').is(':checked');
      if (isCopy) {
        $('.isCopySet').show();
      } else {
        $('.isCopySet').hide();
      }
    },
    'change .q_copy'(/* evt , tmpl*/) {
      const value = $('#q_copy').val();
      // const text = value;
      // To be done
      if (value != null) {
        const question2 = questions.findOne({ _id: value });
        $('#q_category').val(question2.category).change();
        $('#q_name').val(question2.name);
        $('#question').summernote('code', question2.question);
        $('#q_dataType').val(question2.dataType).change();
        if ((
              document.getElementById('q_dataType').value === 'Multiple Select'
            ) ||
            (
              document.getElementById('q_dataType').value === 'Single Select'
            )) {
          $('#options,#options_label').removeClass('hide');
          // $('#options' ).val(question2.options );
          populateOptions(question2);
        }
        $('#q_type').val(question2.qtype);
        $('#q_audience').val(question2.audience).change();
      }
    },
    'change .q_dataType'(evt /* , tmpl*/) {
      const datatype = $(evt.target).val();
      if (datatype === 'Multiple Select' || datatype === 'Single Select') {
        $('#options,#options_label').removeClass('hide');
      } else {
        $('#options,#options_label').addClass('hide');
      }
    },
    'change .q_category'(evt /* , tmpl*/) {
      const datatype = $(evt.target).val();
      if (datatype === 'Other') {
        $('#category').removeClass('hide');
      } else {
        $('#category').addClass('hide');
      }
    },
    'change .locked'(/* evt, tmpl*/) {
      checkLocked();
    },
    'click .save'(event, tmpl) {
      // Getting all values from template. Also creating complete object acc to API.
      let qCategory = tmpl.find('.q_category').value;
      if (qCategory === 'Other') {
        qCategory = tmpl.find('.category').value;
      }
      const questionDescription = tmpl.find('.q_name').value;
      const displayText = $(tmpl.find('.question')).summernote('code');

      const questionDataType = tmpl.find('.q_dataType').value;
      const questionType = $('#q_type').val();
      const audience = $('#q_audience').val();
      const locked = tmpl.find('#locked').checked;
      const allowSkip = tmpl.find('#allowSkip').checked;
      const isUploaded = tmpl.find('#isUploaded').value;
      const copyQuestionId = tmpl.find('#isCopy').checked;

      let options = [];
      const selectstatus = false;
      let optionArray;
      let temp;
      const pickListValues = { pickListValues: [] };
      logger.log(`qtype= ${questionType}`);
      logger.log(`audience= ${audience}`);
      if ((
          questionDataType === 'Multiple Select'
          ) ||
          (
            questionDataType === 'Single Select'
          )) {
        // options = tmpl.find('#options').value;
        // selectstatus=true;
        $('#aoptions').find('tr').each(
          (i, item) => {
            optionArray = {};
            optionArray.value = $(item).find('.value').val();
            optionArray.description = $(item).find('.description').val();
            options.push(optionArray);
            temp = {};
            temp.pickListValueCode = $(item).find('.value').val();
            temp.valueText = $(item).find('.description').val();
            pickListValues.pickListValues.push(temp);
          }
        );
      } else {
        options = '';
      }
      if (qCategory === '') {
        $('#error').html('<b>Please select a question category</b>');
        $('#error').show();
      } else if (questionDescription === '') {
        $('#error').html('<b>Please enter a questions name</b>');
        $('#error').show();
      } else if (displayText === '') {
        $('#error').html('<b>Please enter a display text</b>');
        $('#error').show();
      } else if (questionDataType === '') {
        $('#error').html('<b>Please select a datatype</b>');
        $('#error').show();
      } else if ((
                   selectstatus
                 ) &&
                 (
                   options === ''
                 )) {
        $('#error').html('<b>Please enter options separated by commas </b>');
        $('#error').show();
      } else {
        $('#newQuestionModal').modal('hide');
        $('#error').hide();
        // Setting components for Survey Service API.
        const isUpdate = $('#isUpdate').val();
        const questionID = $('#questionID').val();
        const correctValueForAssessment = null;
        const hudQuestion = (questionType === 'hud');
        const questionWeight = 10;
        const question = {
          questionDescription, displayText, questionDataType, questionType,
          correctValueForAssessment, copyQuestionId, hudQuestion, locked, questionWeight };
        const pickListGroupName = displayText.split(/\s+/).slice(1, 5).join(' ');
        const pickListGroup = { pickListGroupName };
        // check here for surveyServiceQuesId. If already there, update else save.
        logger.error(`Question Add and update: ${(isUploaded) ? 'Update' : 'Add'}`);
        if (isUploaded) {
          // Means it is already uploaded to HMIS Survey Service. We have the ID.
          Meteor.call('gettingQuestionDetails', isUploaded, (error, resul) => {
            if (error) {
              logger.info(error);
            } else {
              logger.info(resul);
              if (questionDataType === 'Single Select' || questionDataType === 'Multiple Select') {
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
                        logger.info(`Pick List Group Create: ${res}`);
                        question.pickListGroupId = resul.pickListGroupId;
                        logger.info(`Sending PickList Values: ${pickListValues}`);
                        Meteor.call(
                          'addingPickListValues', resul.pickListGroupId, pickListValues,
                          (er, re) => {
                            if (er) {
                              logger.error(`ERROR Pick List Values Add: ${er}`);
                            } else {
                              logger.info(`Pick List Values Add: ${re}`);
                              // to see if picklist Id changes.
                              logger.info(JSON.stringify(question));
                              Meteor.call('updatingQuestionSurveyService',
                                question, isUploaded, (e, r) => {
                                  if (e) {
                                    logger.error(`ERROR Question Update: ${e}`);
                                  } else {
                                    logger.info(`Question Update: ${r}`);
                                    Meteor.call(
                                      'updateQuestion', questionID, qCategory, questionDescription,
                                      displayText, questionDataType, options, questionType,
                                      audience, locked, allowSkip, copyQuestionId,
                                      isUploaded, (Err, Res) => {
                                        if (Err) {
                                          logger.error(`ERROR Mongo Update: ${Err}`);
                                        } else {
                                          logger.log(`Mongo Update: ${Res}`);
                                          resetQuestionModal();
                                        }
                                      }
                                    );
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
                Meteor.call('updatingQuestionSurveyService', question, isUploaded, (e, r) => {
                  if (e) {
                    logger.error(`ERROR Question Update: ${e}`);
                  } else {
                    logger.info(`Question Update: ${r}`);
                    Meteor.call('updateQuestion', questionID, qCategory, questionDescription,
                      displayText, questionDataType, options, questionType,
                      audience, locked, allowSkip, copyQuestionId, isUploaded, (Err, Res) => {
                        if (Err) {
                          logger.error(`ERROR Mongo Update: ${Err}`);
                        } else {
                          logger.log(`Mongo Update: ${Res}`);
                          resetQuestionModal();
                        }
                      }
                    );
                  }
                });
              }
              // Call updateQuestionToSurveyService here.
              // Call meteor callbacks in result of those, so that we can update locally.
            }
          });
        } else {
          // It's not yet uploaded, upload it to HMIS first, then save the QID recvd in Mongo.
          if (questionDataType === 'Single Select' || questionDataType === 'Multiple Select') {
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
                            } else {
                              const surveyServiceQuesId = res.questionId;
                              // Call question save to Mongo DB here.
                              if (isUpdate === '1') {
                                Meteor.call(
                                  'updateQuestion', questionID, qCategory, questionDescription,
                                  displayText, questionDataType, options, questionType, audience,
                                  locked, allowSkip, copyQuestionId, surveyServiceQuesId,
                                  (error, result) => {
                                    if (error) {
                                      logger.error(`ERROR Mongo Update: ${error}`);
                                    } else {
                                      logger.info(`Mongo Update: ${result}`);
                                      resetQuestionModal();
                                    }
                                  }
                                );
                              } else {
                                Meteor.call(
                                  'addQuestion', qCategory, questionDescription, displayText,
                                  questionDataType, options, questionType, audience, locked,
                                  allowSkip, copyQuestionId, surveyServiceQuesId,
                                  (error, result) => {
                                    if (error) {
                                      logger.error(`ERROR Mongo Add: ${error}`);
                                    } else {
                                      logger.info(`Mongo Add: ${result}`);
                                      resetQuestionModal();
                                    }
                                  }
                                );
                              }
                            }
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
              } else {
                const surveyServiceQuesId = res.questionId;
                // Call question save to Mongo DB here.
                if (isUpdate === '1') {
                  Meteor.call(
                    'updateQuestion', questionID, qCategory, questionDescription,
                    displayText, questionDataType, options, questionType, audience,
                    locked, allowSkip, copyQuestionId, surveyServiceQuesId, (error, result) => {
                      if (error) {
                        logger.error(`ERROR Mongo Update: ${error}`);
                      } else {
                        logger.info(`Mongo Update: ${result}`);
                        resetQuestionModal();
                      }
                    }
                  );
                } else {
                  Meteor.call(
                    'addQuestion', qCategory, questionDescription, displayText, questionDataType,
                    options, questionType, audience, locked, allowSkip, copyQuestionId,
                    surveyServiceQuesId, (error, result) => {
                      if (error) {
                        logger.error(`ERROR Mongo Add: ${error}`);
                      } else {
                        logger.info(`Mongo Add: ${result}`);
                        resetQuestionModal();
                      }
                    }
                  );
                }
              }
            });
          }
        }
      }
    },
    'click .cancel'() {
      resetQuestionModal();
    },
    'click .close'() {
      resetQuestionModal();
    },
    'click .remove'(/* evt, tmp1*/) {
      const questionID = $('#questionID').val();
      Meteor.call(
        'removeQuestion', questionID, (error, result) => {
          if (error) {
            logger.log(error);
          } else {
            logger.log(result);
          }
        }
      );

      resetQuestionModal();
    },
  }
);

Session.setDefault('section_id', null);
// let section_id;
let skipVal;
Template.surveyEditTemplate.events(
  {
    'click .addQues'(event, tmpl) {
      // if(tmpl.find('.section').value!="Other" || tmpl.find('.section').value!="sectionSelect") {
      // 	return;
      // }
      // else {
      // 	alert('Select a Section');
      // 	return false;
      // }

      const secValue = tmpl.find('.section').value;
      logger.log(`section value: ${secValue}`);
      if (secValue === 'sectionSelect') {
        alert('Please select/enter a section');
        return false;
      }
      Session.set('section_id', tmpl.find('.section').value);
      return true;
    },
    'click .addSection'(event, tmpl) {
      const surveyingTitle = tmpl.data.title;
      const surveyingId = tmpl.data._id;
      const content = tmpl.find('.sectionName').value;
      const contentType = 'section';
      let sectionId = ' ';
      logger.log(`content: ${content}`);
      skipVal = tmpl.find('.showskip').checked;

      Meteor.call(
        'addSurveyQuestionMaster',
        surveyingTitle,
        surveyingId,
        sectionId,
        skipVal,
        contentType,
        content,
        maxRank(surveyingId, 'section'),
        (error, result) => {
          if (error) {
            logger.log(error);
          } else {
            logger.log(result);

            sectionId = result;

            if (sectionId != null) {
              $("#section_val option[value='sectionSelect']").remove();
            } else {
              $("#section_val option[value='sectionSelect']").val('Select a Section');
            }

            $('#section_val').val(sectionId);
            // if(section_id!=null){
            // 	$('.sectionSelect').removeClass('hide');
            // } else {
            // 	$('.sectionSelect').addClass('hide');
            // }


            // var surveyQuestionsMasterCollection = HomeUtils.adminCollectionObject(
            // 'surveyQuestionsMaster'
            // );
            // var section_name = surveyQuestionsMasterCollection.
              // find({_id: section_id},{content:1,_id:0}).fetch();
            //
            // for(var i in section_name){
            // 	logger.log("sec_name: " + section_id);
            // 	$('#section_val').val(section_id);
            //
            // }
            delete Session.keys.sectionId;
          }
        }
      );

      $('#sectionName').val('');
    },
    'click .addLabel'(event, tmpl) {
      const surveyingTitle = tmpl.data.title;
      const surveyingId = tmpl.data._id;
      const content = tmpl.find('.labelName').value;
      const contentType = 'labels';
      const sectionId = tmpl.find('.section').value;
      logger.log(`section id: ${sectionId}`);
      logger.log(`SEC_ID: ${Session.get('section_id')}`);
      skipVal = tmpl.find('.showskip').value;

      Meteor.call(
        'addSurveyQuestionMaster',
        surveyingTitle,
        surveyingId,
        sectionId,
        skipVal,
        contentType,
        content,
        maxRank(surveyingId, 'question'),
        (error, result) => {
          if (error) {
            logger.log(error);
          } else {
            logger.log(result);
          }
        }
      );


      $('#labelName').val('');
      // $("#skip_id").attr('checked',false);
      $("#section_val option[value='sectionSelect']").val('Select a Section');
    },

    'submit form'(event/* , tmpl*/) {
      event.preventDefault();
    },
    'change .section'(event/* , tmp*/) {
      const section = $(event.target).val();
      if (section === 'Other' || section === 'sectionSelect') {
        $('#sectionName').removeClass('hide');
      } else {
        $('#sectionName').addClass('hide');
      }
    },
  }
);

Template.sortableItemTarget.events(
  {
    'dblclick .name'(event, template) {
      // Make the name editable. We should use an existing component, but it's
      // in a sorry state - https://github.com/arillo/meteor-x-editable/issues/1
      const surveyQuestionsMasterCollection = HomeUtils.adminCollectionObject(
        'surveyQuestionsMaster'
      );
      let input;
      const cont = surveyQuestionsMasterCollection.find({ _id: this._id },
          { content_type: 1, _id: 0 }).fetch();
      let contentType;
      for (let i = 0; i < cont.length; i++) {
        contentType = cont[i].content_type;
      }
      if (contentType === 'question') {
        alert('Question cannot be edited');
        input.hide();
        template.$('.name').show();
      } else {
        const name = template.$('.name');
        input = template.$('input');
        if (input.length) {  // jQuery never returns null - http://stackoverflow.com/questions/920236/how-can-i-detect-if-a-selector-returns-null
          input.show();
        } else {
          const temp = 'class = "form-control" type="text"';
          input =
            $(`<input ${temp} placeholder=" ${this.content} " style="display: inline">`);
          name.after(input);
        }
        name.hide();
        input.focus();
      }
    },
    'blur input[type=text]'(event, template) {
      // var cont = SurveyQuestionsSchema.find({_id:this._id},{content_type:1,_id:0}).fetch();
      //   for(var i in cont){
      //         var contentType = cont[i].content_type
      //       }
      //   if(contentType == "question"){
      //     alert("Question cannot be edited");
      //     input.hide();
      //      template.$('.name').show();
      //   }
      // commit the change to the name, if any
      const input = template.$('input');
      input.hide();
      template.$('.name').show();
      // TODO - what is the collection here? We'll hard-code for now.
      // https://github.com/meteor/meteor/issues/3303
      if (this.name !== input.val() && this.name !== '') {
        //   var cont = SurveyQuestionsSchema.find({_id:this._id},{content_type:1,_id:0}).fetch();
        //   for(var i in cont){
        //         var contentType = cont[i].content_type
        //       }
        //   if(contentType == "question"){
        //     alert("Question cannot be edited");
        //   }else{

        Meteor.call(
          'updateSurveyQuestionMaster', this._id, input.val(), (error, result) => {
            if (error) {
              logger.log(error);
            } else {
              logger.log(result);
            }
          }
        );
      }
    },
    'keydown input[type=text]'(event, template) {
      if (event.which === 27) {
        // ESC - discard edits and keep existing value
        template.$('input').val(this.name);
        event.preventDefault();
        event.target.blur();
      } else if (event.which === 13) {
        // ENTER
        event.preventDefault();
        event.target.blur();
      }
    },
    'click .close'(/* event, template*/) {
      // `this` is the data context set by the enclosing block helper (#each, here)

      Meteor.call(
        'removeSurveyQuestionMaster', this._id, (error, result) => {
          if (error) {
            logger.log(error);
          } else {
            logger.log(result);
          }
        }
      );

      // custom code, working on a specific collection
      const surveyQuestionsMasterCollection = HomeUtils.adminCollectionObject(
        'surveyQuestionsMaster'
      );
      if (surveyQuestionsMasterCollection.find({}).count() === 0) {
        Meteor.setTimeout(
          () => {
            alert('Not nice to delete the entire list! Add some attributes instead.');
          }, 1000
        );
      }
    },
  }
);

Template.sortableSectionItem.events(
  {
    'click .close'(/* event, template*/) {
      // `this` is the data context set by the enclosing block helper (#each, here)
      // Give out a warning here, before deleting.
      Meteor.call(
        'removeSurveyQuestionMasterSection', this._id, (error, result) => {
          if (error) {
            logger.log(error);
          } else {
            logger.log(result);
          }
        }
      );
    },
  }
);
Template.typeDefinition.events(
  {
    'click .fix-survey-order': () => {
      const context = Router.current();

      Meteor.call('fixSurveyQuestionMasterOrder', context.params._id, (error, result) => {
        if (error) {
          logger.log(error);
        } else {
          logger.log(result);
        }
      });
    },
  }
);

Template.selectQuestions.events(
  {
    'click .selectques'(evt, tmpl) {
      evt.preventDefault();

      const selected = tmpl.findAll('input[type=checkbox]:checked');
      const array = selected.map((item) => item.value);
      Session.set('selectedQuestions', array);
      const surveyId = tmpl.data._id;
      const surveyingTitle = tmpl.data.title;
      const arrayLength = array.length;
      for (let i = 0; i < arrayLength; i ++) {
        array[i] = array[i].substring(0, array[i].length - 1);
      }
      logger.log(`Ques: ${array}`);
      // get section's Id which is at the bottom.
      const surveyQuestionsMasterCollection = HomeUtils.adminCollectionObject(
        'surveyQuestionsMaster'
      );
      const lastSection = surveyQuestionsMasterCollection.findOne(
        { $and: [
          { surveyID: surveyId },
          { contentType: 'section' },
        ] },
        { sort: { order: -1 } }
      );
      let order = maxRank(surveyId, 'question');
      logger.log(`skip val: ${order}`);
      for (let i = 0; i < array.length; i ++) {
        Meteor.call(
          'addSurveyQuestionMaster',
          surveyingTitle,
          surveyId,
          lastSection._id,
          skipVal,
          'question',
          array[i],
          order++,
          (error, result) => {
            if (error) {
              logger.log(error);
            } else {
              logger.log(result);
            }
          }
        );
      }

      Router.go('adminDashboardsurveysEdit', { _id: tmpl.data._id });
    },
  }
);
