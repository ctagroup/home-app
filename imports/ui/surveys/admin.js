import { logger } from '/imports/utils/logger';
import { maxRank } from '/imports/ui/surveys/helpers';
import Surveys from '/imports/api/surveys/surveys';

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


function setSurveyFields(status) {
  $('#survey_title').attr('disabled', status);
  $('#active').attr('disabled', status);
  $('#copy').attr('disabled', status);
  $('#s_copy').attr('disabled', status);
  $('#s_type').attr('disabled', status);
}

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
  setSurveyFields(false);
}

function sectionComponents(originalSurveyComponentIDs, newSurveSectionIDs, newSurveyingID) {
  logger.log(`new survey ID: ${newSurveyingID}`);
  logger.log(`Sub sections: ${originalSurveyComponentIDs}`);
  logger.log(`new section ID: ${newSurveSectionIDs}`);

  const surveyQuestionsMasterCollection = null; // ...
  // ... HomeUtils.adminCollectionObject('surveyQuestionsMaster');
  const sectionComponent = surveyQuestionsMasterCollection
    .find({ _id: originalSurveyComponentIDs }).fetch();

  for (let i = 0; i < sectionComponent.length; i += 1) {
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
  const surveyQuestionsMasterCollection = null;// ...
  // ... HomeUtils.adminCollectionObject('surveyQuestionsMaster');
  const mainSections = surveyQuestionsMasterCollection.find({ _id: mainSectionIDs }).fetch();

  const componentsIDs = surveyQuestionsMasterCollection
    .find({ sectionID: mainSectionIDs }, { _id: 1 }).fetch();
  compIDs = [];

  const loopFunc = (error, result) => {
    if (error) {
      logger.log(error);
    } else {
      Session.set('SectionID', result);
      for (let j = 0; j < componentsIDs.length; j += 1) {
        compIDs[j] = componentsIDs[j]._id;
        sectionComponents(compIDs[j], Session.get('SectionID'), surveyingID);
      }
    }
  };
  for (let i = 0; i < mainSections.length; i += 1) {
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

  const surveyQuestionsMasterCollection = null; // ...
  // ... HomeUtils.adminCollectionObject('surveyQuestionsMaster');
  const AllRecordsForCopy = surveyQuestionsMasterCollection
    .find({ surveyID: surveyIDForCopy }, { sectionID: 1 }).fetch();

  for (let i = 0; i < AllRecordsForCopy.length; i += 1) {
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

function checkSurveyLocked() {
  const toggle = $('#locked').is(':checked');
  if (toggle) {
    setSurveyFields(true);
  } else {
    setSurveyFields(false);
  }
}

Template.surveyForm.events(
  {
    'change .s_copy': (event) => {
      surveyIDForCopy = $(event.target).val();

      const surveyRecord = Surveys.findOne({ _id: surveyIDForCopy });

      document.getElementById('copyof_surveytitle').value = surveyRecord.title;
      document.getElementById('copy_active').checked = surveyRecord.active;

      $('.s_copy').val('Choose');
    },
    'change .locked': (/* evt, tmpl*/) => {
      checkSurveyLocked();
    },
    'click .save': (evt, tmpl) => {
      const created = false;
      surveyID = $('#surveyID').val();
      const copy = tmpl.find('.copy').checked;
      const stype = tmpl.find('.s_type').value;

      let title = tmpl.find('.survey_title').value;
      let active = tmpl.find('.active').checked;
      const locked = tmpl.find('#locked').checked;
      if (copy) {
        title = tmpl.find('.copyof_surveytitle').value;
        surveyCopyTitle = title;

        active = tmpl.find('.copy_active').checked;
        // const surveyCopyId = $('#surveyID').val();
      }

      Meteor.call(
        'addSurvey', title, active, copy, surveyID, stype, created, locked, (error, result) => {
          if (error) {
            logger.log(error);
          } else if (result != null) {
            if (copy) {
              recordsForCopy(result);
            } else {
              logger.log(result);
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
      const locked = tmpl.find('#locked').checked;
      const isUpdate = $('#isUpdate').val();
      if (isUpdate === '1') {
        Meteor.call(
          'updateSurvey', surveyID, title, stype, active, locked, (error, result) => {
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
    'click .cancel': () => {
      resetSurveyModal();
    },
    'click .close': () => {
      resetSurveyModal();
    },
    'click .copy': () => {
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
    'click .remove': (/* evt, tmpl*/) => {
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


Template.surveyViewTemplate.events(
  {
    'click .addSurvey': (/* evt, tmpl*/) => {
      resetSurveyModal();
      $('.copy').show();
      $('.copylabel').show();
      $('.showWhenEdit').hide();
      $('.showWhenNew').show();
    },
    'click .edit': (event) => {
      const surveyCollection = Surveys;
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
      if (typeof survey.locked === 'boolean') {
        $('#newSurveyModal').find('input[type=checkbox]#locked').attr('checked', survey.locked);
        $('#newSurveyModal').find('input[type=checkbox]#locked').prop('checked', survey.locked);
        if (survey.locked) {
          checkSurveyLocked();
        }
      }
      $('#isUpdate').val('1');
      $('#surveyID').val($(event.currentTarget).data('survey-id'));

      $('.showWhenEdit').show();
      $('.showWhenNew').hide();
    },
  }
);

Session.setDefault('section_id', null);
// let section_id;
let skipVal;
Template.surveyEditTemplate.events(
  {
    'click .addQues': (event, tmpl) => {
      // if(tmpl.find('.section').value!="Other" || tmpl.find('.section').value!="sectionSelect") {
      // return;
      // }
      // else {
      // alert('Select a Section');
      // return false;
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
    'click .addSection': (event, tmpl) => {
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
            // $('.sectionSelect').removeClass('hide');
            // } else {
            // $('.sectionSelect').addClass('hide');
            // }


            // var surveyQuestionsMasterCollection = HomeUtils.adminCollectionObject(
            // 'surveyQuestionsMaster'
            // );
            // var section_name = surveyQuestionsMasterCollection.
            // find({_id: section_id},{content:1,_id:0}).fetch();
            //
            // for(var i in section_name){
            // logger.log("sec_name: " + section_id);
            // $('#section_val').val(section_id);
            //
            // }
            delete Session.keys.sectionId;
          }
        }
      );

      $('#sectionName').val('');
    },
    'click .addLabel': (event, tmpl) => {
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

    'submit form': (event/* , tmpl*/) => {
      event.preventDefault();
    },
    'change .section': (event/* , tmp*/) => {
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
    'dblclick .name': (event, template) => {
      // Make the name editable. We should use an existing component, but it's
      // in a sorry state - https://github.com/arillo/meteor-x-editable/issues/1
      const surveyQuestionsMasterCollection = null; // ...
      // ... HomeUtils.adminCollectionObject('surveyQuestionsMaster');
      let input;
      const cont = surveyQuestionsMasterCollection.find({ _id: this._id },
          { content_type: 1, _id: 0 }).fetch();
      let contentType;
      for (let i = 0; i < cont.length; i += 1) {
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
    'blur input[type=text]': (event, template) => {
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
    'keydown input[type=text]': (event, template) => {
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
    'click .remove-item': (event, template) => {
      Meteor.call(
        'removeSurveyQuestionMaster', template.data._id, (error, result) => {
          if (error) {
            logger.log(error);
          } else {
            logger.log(result);
          }
        }
      );

      // custom code, working on a specific collection
      const surveyQuestionsMasterCollection = null; // ...
      // ... HomeUtils.adminCollectionObject('surveyQuestionsMaster');
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
    'click .remove-section': (event, template) => {
      Meteor.call(
        'removeSurveyQuestionMasterSection', template.data._id, (error, result) => {
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

