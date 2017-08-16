import { logger } from '/imports/utils/logger';
import { populateOptions, resetQuestionModal, setFields } from '/imports/ui/questions/helpers';
import './questionForm.html';

function checkLocked() {
  const toggle = $('#locked').is(':checked');
  if (toggle) {
    setFields(true);
  } else {
    setFields(false);
  }
}

Template.questionForm.helpers(
  {
    questionList() {
      const questionCollection = HomeUtils.adminCollectionObject('questions');
      return questionCollection.find({}).fetch();
    },
    getQuestionCategory() {
      const questionCollection = HomeUtils.adminCollectionObject('questions');
      const distinctEntries = _.uniq(
        questionCollection.find(
          {},
          { sort: { category: 1 }, fields: { category: true } }
        ).fetch().map(
          x => x.category
        ), true
      );
      return distinctEntries;
    },
  }
);

Template.questionForm.events(
  {
    'click .optionadd': (/* evt, tmpl*/) => {
      let optionLength = $('#aoptions').children().length;
      let optionsTag;
      optionLength += 1;
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
    'click .toggle': (/* evt, tmpl*/) => {
      const isCopy = $('#isCopy').is(':checked');
      if (isCopy) {
        $('.isCopySet').show();
      } else {
        $('.isCopySet').hide();
      }
    },
    'change .q_copy': (/* evt , tmpl*/) => {
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
    'change .q_dataType': (evt /* , tmpl*/) => {
      const datatype = $(evt.target).val();
      if (datatype === 'Multiple Select' || datatype === 'Single Select') {
        $('#options,#options_label').removeClass('hide');
      } else {
        $('#options,#options_label').addClass('hide');
      }
    },
    'change .q_category': (evt /* , tmpl*/) => {
      const datatype = $(evt.target).val();
      if (datatype === 'Other') {
        $('#category').removeClass('hide');
      } else {
        $('#category').addClass('hide');
      }
    },
    'change .locked': (/* evt, tmpl*/) => {
      checkLocked();
    },
    'click .save': (event, tmpl) => {
      // Getting all values from template. Also creating complete object acc to API.
      let category = tmpl.find('.q_category').value;
      if (category === 'Other') {
        category = tmpl.find('.category').value;
      }
      const name = tmpl.find('.q_name').value;
      const question = $(tmpl.find('.question')).summernote('code');

      const dataType = tmpl.find('.q_dataType').value;
      const qtype = $('#q_type').val();
      const audience = $('#q_audience').val();
      const locked = tmpl.find('#locked').checked;
      const allowSkip = tmpl.find('#allowSkip').checked;
      const isUploaded = tmpl.find('#isUploaded').value;
      const isCopy = tmpl.find('#isCopy').checked;

      let options = [];
      const selectstatus = false;
      let optionArray;
      logger.log(`qtype= ${qtype}`);
      logger.log(`audience= ${audience}`);
      if ((
          dataType === 'Multiple Select'
          ) ||
          (
            dataType === 'Single Select'
          )) {
        // options = tmpl.find('#options').value;
        // selectstatus=true;
        $('#aoptions').find('tr').each(
          (i, item) => {
            optionArray = {};
            optionArray.value = $(item).find('.value').val();
            optionArray.description = $(item).find('.description').val();
            options.push(optionArray);
          }
        );
      } else {
        options = '';
      }
      if (category === '') {
        $('#error').html('<b>Please select a question category</b>');
        $('#error').show();
      } else if (name === '') {
        $('#error').html('<b>Please enter a questions name</b>');
        $('#error').show();
      } else if (question === '') {
        $('#error').html('<b>Please enter a display text</b>');
        $('#error').show();
      } else if (dataType === '') {
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
        // ----------hmisQuesSync----------
        // check here for surveyServiceQuesId. If already there, update else save.
        logger.info(`Question Add and update: ${(isUploaded) ? 'Update' : 'Add'}`);
        if (isUploaded) { // isUploaded by default contains the API Id.
          // Means it is already uploaded to HMIS Survey Service. We have the ID.
          const surveyServiceQuesId = isUploaded;
          const ques = {
            name,
            question,
            category,
            options,
            dataType,
            qtype,
            audience,
            locked,
            allowSkip,
            isCopy,
            surveyServiceQuesId,
          };
          hmisQuesSync.updatingQuesToHmis(ques);
          if (isUpdate === '1') {
            Meteor.call(
              'updateQuestion', questionID, category, name,
              question, dataType, options, qtype, audience,
              locked, allowSkip, isCopy, surveyServiceQuesId, (error, result) => {
                if (error) {
                  logger.error(`ERROR Mongo Update: ${error}`);
                } else {
                  logger.info(`Mongo Update: ${result}`);
                  resetQuestionModal();
                }
              }
            );
          }
        } else if (isUpdate === '1') {
          // It's not yet uploaded, upload it to HMIS first, then save the QID recvd in Mongo.
          Meteor.call(
            'updateQuestion', questionID, category, name, question, dataType, options, qtype,
            audience, locked, allowSkip, isCopy, (error, result) => {
              if (error) {
                logger.error(`ERROR Mongo Update: ${error}`);
              } else {
                logger.info(`Mongo Update: ${result}`);
                // Send the question Id also.
                const ques = {
                  name,
                  question,
                  category,
                  options,
                  dataType,
                  qtype,
                  audience,
                  locked,
                  allowSkip,
                  isCopy,
                };
                hmisQuesSync.addingQuestionToHmis(ques, questionID);
                resetQuestionModal();
              }
            }
          );
        } else {
          Meteor.call(
            'addQuestion', category, name, question, dataType,
            options, qtype, audience, locked, allowSkip, isCopy, (error, resultId) => {
              if (error) {
                logger.error(`ERROR Mongo Add: ${error}`);
              } else {
                logger.info(`Mongo Add: ${resultId}`);
                // send question Id also.
                const ques = {
                  name,
                  question,
                  category,
                  options,
                  dataType,
                  qtype,
                  audience,
                  locked,
                  allowSkip,
                  isCopy,
                };
                hmisQuesSync.addingQuestionToHmis(ques, resultId);
                resetQuestionModal();
              }
            }
          );
        }
      }
    },
    'click .cancel': () => {
      resetQuestionModal();
    },
    'click .close': () => {
      resetQuestionModal();
    },
    'click .remove': (/* evt, tmp1*/) => {
      const questionID = $('#questionID').val();
      Meteor.call('deleteQuestion', questionID, (err, res) => {
        if (err) {
          logger.error(`Error deleting question: ${err}`);
        } else {
          logger.info(`Success deleting question: ${res}`);
        }
      });
      resetQuestionModal();
    },
  }
);

Template.questionForm.onRendered(() => {
  $('.js-summernote').summernote({
    minHeight: 100,
    fontNames: HomeConfig.fontFamilies,
  });
});
