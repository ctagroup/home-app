/**
 * Created by udit on 10/02/16.
 */
Template.AdminRoleManager.events(
  {
    'click .js-update': (e) => {
      e.preventDefault();
      const serializeInput = $('#js-frm-role-manager').serializeArray();
      $('#js-frm-role-manager :input').attr('disabled', true);
      Meteor.call(
        'updateRolePermissions', serializeInput, (error, result) => {
          if (error) {
            logger.log(error);
          } else {
            logger.log(result);
          }
          $('#js-frm-role-manager :input').attr('disabled', false);
        }
      );
    },
    'click .js-reset': (e) => {
      e.preventDefault();
      Meteor.call(
        'resetRolePermissions', (error, result) => {
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

let surveyCopyId;
let surveyIDForCopy;
let surveyID;
let surveyTitle;
let masterSectionIDs;
let originalSurveyId;
let sectionComponentsID;
let originalSurveyUniqueIDs;
let surveyCopySectionID;
let surveyCopyTitle;

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
      const isUpdate = $('#isUpdate').val();
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
        surveyCopyId = $('#surveyID').val();
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
      var title = tmpl.find('.survey_title').value;
      var active = tmpl.find('.active').checked;
      var stype = tmpl.find(".s_type").value;

      var isUpdate = $('#isUpdate').val();
      if (isUpdate == '1') {

        Meteor.call(
          "updateSurvey", surveyID, title, stype, active, function (error, result) {
            if (error) {
              console.log(error);
            } else {
              console.log(result);
            }
          }
        );
        Meteor.call(
          "updateSurveyQuestionMasterTitle", surveyID, title, function (error, result) {

            if (error) {
              console.log(error);
            } else {
              console.log(result);
            }
          }
        );
      }
      resetSurveyModal();
    },
    'click .cancel': function (evt, tmpl) {
      resetSurveyModal();
    },
    'click .close': function (evt, tmpl) {
      resetSurveyModal();
    },
    'click .copy': function (evt, tmpl) {

      var copy = $('#copy').is(':checked');
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
    'click .remove': function (evt, tmpl) {
      var surveyID = $('#surveyID').val();
      Meteor.call(
        "removeSurvey", surveyID, function (error, result) {
          if (error) {
            console.log(error);
          } else {
            console.log(result);
          }
        }
      );
      Meteor.call(
        "removeSurveyCopyQuestionMaster", surveyTitle, function (error, result) {

          if (error) {
            console.log(error);
          } else {
            console.log(result);
          }
        }
      );
      resetSurveyModal();
    }

  }
);
var new_SurveyID;
function recordsForCopy(surveyID) {

  // console.log("new survey ID: " + surveyID);
  new_SurveyID = surveyID;
  var sectionArray = new Array();

  var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");
  var records_forCopy = surveyQuestionsMasterCollection.find({ surveyID: surveyIDForCopy }, { sectionID: 1 }).fetch();

  for (var i in records_forCopy) {

    originalSurveyUniqueIDs = records_forCopy[i]._id;
    surveyCopySectionID = records_forCopy[i].sectionID;

    if (surveyCopySectionID == null) {
      masterSectionIDs = originalSurveyUniqueIDs;
      mainSection(masterSectionIDs, new_SurveyID);

    } else {
      sectionComponentsID = originalSurveyUniqueIDs;
    }
  }
}
var compIDs;
function mainSection(mainSectionIDs, surveyID) {


  var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");
  var mainSections = surveyQuestionsMasterCollection.find({ _id: mainSectionIDs }).fetch();

  var componentsIDs = surveyQuestionsMasterCollection.find({ sectionID: mainSectionIDs }, { _id: 1 }).fetch();
  var compIDs = new Array();

  for (var i in mainSections) {

    surveyTitle = surveyCopyTitle;
    originalSurveyId = surveyIDForCopy;
    var surveyCopy_skipValue = mainSections[i].allowSkip;
    var surveyCopy_contentType = mainSections[i].contentType;
    var surveyCopy_content = mainSections[i].content;
    var surveyCopy_rank = mainSections[i].order;

    Meteor.call(
      "addSurveyQuestionMaster",
      surveyTitle,
      surveyID,
      ' ',
      surveyCopy_skipValue,
      surveyCopy_contentType,
      surveyCopy_content,
      surveyCopy_rank,
      function (error, result) {
        if (error) {
          console.log(error);
        } else {
          Session.set('SectionID', result)
          for (var j in componentsIDs) {

            compIDs[j] = componentsIDs[j]._id;
            sectionComponents(compIDs[j], Session.get('SectionID'), surveyID);
          }

        }
      }
    );
    resetSurveyModal();
  }
}

function sectionComponents(originalSurvey_componentIDs, newsurvey_sectionIDs, new_surveyID) {

  console.log("new survey ID: " + new_surveyID);
  console.log("Sub sections: " + originalSurvey_componentIDs);
  console.log("new section ID: " + newsurvey_sectionIDs);

  var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");
  var section_components = surveyQuestionsMasterCollection.find({ _id: originalSurvey_componentIDs }).fetch();

  for (var i in section_components) {

    surveyTitle = surveyCopyTitle;
    originalSurveyId = surveyIDForCopy;
    surveyCopy_skipValue = section_components[i].allowSkip;
    surveyCopy_contentType = section_components[i].contentType;
    surveyCopy_content = section_components[i].content;
    surveyCopy_rank = section_components[i].order;

    Meteor.call(
      "addSurveyQuestionMaster",
      surveyTitle,
      new_surveyID,
      newsurvey_sectionIDs,
      surveyCopy_skipValue,
      surveyCopy_contentType,
      surveyCopy_content,
      surveyCopy_rank,
      function (error, result) {
        if (error) {
          console.log(error);
        } else {
          console.log(result);
        }
      }
    );
    resetSurveyModal();
  }
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
}

function resetQuestionModal() {
  $('#newQuestionModal input[type=text]').val('');
  $('#newQuestionModal select').val('').change();
  $('#newQuestionModal input[type=checkbox]').attr('checked', false);
  $('#newQuestionModal input[type=checkbox]').prop('checked', false);
  $('.isCopySet').hide();
  $('#isUpdate').val('0');
  $('#questionID').val('');

}

function checkLocked() {
  var toggle = $('#locked').is(':checked');
  if (toggle) {
    setFields(true);
  } else {
    setFields(false);
  }
}

function setFields(status) {
  $('#isCopy').attr('disabled', status);
  $('#q_copy').attr('disabled', status);
  $('#q_category').attr('disabled', status);
  $('#q_name').attr('disabled', status);
  $('#question').attr('disabled', status);
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

function maxRank(survey_id) {
  var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");

  if (surveyQuestionsMasterCollection.find({ surveyID: survey_id }).count() <= 0) {
    return 0;
  } else {
    var order = surveyQuestionsMasterCollection.find({ surveyID: survey_id }, { sort: { order: - 1 } }).fetch();
    var maxOrder = 0;
    for (var i in order) {
      maxOrder = order[i].order + 1;
    }
    return maxOrder;
  }
}

Template.surveyViewTemplate.events(
  {
    'click .addSurvey': function (evt, tmpl) {
      resetSurveyModal();
      $('.copy').show();
      $('.copylabel').show();
      $('.showWhenEdit').hide();
      $('.showWhenNew').show();
    }
  }
);
Template.surveyRow.events(
  {
    'click .edit': function (evt, tmpl) {


      var surveyCollection = adminCollectionObject("surveys");
      var survey = surveyCollection.findOne({ _id: tmpl.data._id });
      var copy = survey.copy;

      $('.copy').hide();
      $('.copylabel').hide();
      $('.isCopyTrue').hide();

      if (copy) {
        $('.copyof_surveytitle').show();
        $('.copy_active').show();
        $('.survey_title').hide();
        $('.active').hide();
      } else {
        $('.copyof_surveytitle').hide();
        $('.copy_active').hide();
        $('.survey_title').show();
        $('.active').show();
      }

      if (copy) {
        $('#newSurveyModal input[type=text]#copyof_surveytitle').val(survey.title);
        $('#newSurveyModal input[type=checkbox]#copy_active').attr('checked', survey.active);
        $('#newSurveyModal input[type=checkbox]#copy_active').prop('checked', survey.active);
      }

      else {
        $('#newSurveyModal input[type=text]#survey_title').val(survey.title);
        $('#newSurveyModal input[type=checkbox]#active').attr('checked', survey.active);
        $('#newSurveyModal input[type=checkbox]#active').prop('checked', survey.active);
        $('#newSurveyModal input[type=checkbox]#copy').attr('checked', survey.copy);
        $('#newSurveyModal input[type=checkbox]#copy').prop('checked', survey.copy);
      }
      $('#isUpdate').val('1');
      $('#surveyID').val(tmpl.data._id);

      $('.showWhenEdit').show();
      $('.showWhenNew').hide();

    }

  }
);

Template.questionViewTemplate.events(
  {
    'click .addQuestion': function (evt, tmpl) {

      $('#aoptions').empty();
      resetQuestionModal();
      $('.showWhenEdit').hide();
      $('.showWhenNew').show();
      setFields(false);
    }
  }
);

Template.questionForm.events(
  {
    'click .optionadd': function (evt, tmpl) {
      var optionLength = $('#aoptions').children().length;
      optionLength = optionLength + 1;
      optionsTag =
        "<tr  id='" +
        optionLength +
        "' class='questionRow'><td><input type='number' id='" +
        optionLength +
        ".value' class='value' value=''/></td>";
      optionsTag +=
        "<td><textarea rows='1' cols='40' id='" +
        optionLength +
        ".description' class='description' value=''></textarea></td>";

      optionsTag +=
        "<td><a id='delete." +
        optionLength +
        "' class='btn btn-primary optionremove'><span class='fa fa-remove'></span></a></td></tr>";
      $('#aoptions').append(optionsTag);
      $('#aoptions').on(
        "click", "a.optionremove", function () {
          var row_id = $(this).attr('id');
          var i = row_id.split('.');
          var i1 = i[1];
          $('#' + i1).remove();
        }
      );
    },
    'click .toggle': function (evt, tmpl) {
      var isCopy = $('#isCopy').is(':checked');
      if (isCopy) {
        $('.isCopySet').show();
      } else {
        $('.isCopySet').hide();
      }

    },
    'change .q_copy': function (evt, tmpl) {

      var value = $('#q_copy').val();
      var text = value;
      //To be done
      if (value != null) {
        var question2 = questions.findOne({ _id: value });
        $('#q_category').val(question2.category).change();
        $('#q_name').val(question2.name);
        $('#question').val(question2.question);
        $('#q_dataType').val(question2.dataType).change();
        if ((
              document.getElementById('q_dataType').value == "Multiple Select"
            ) ||
            (
              document.getElementById('q_dataType').value == "Single Select"
            )) {
          $('#options,#options_label').removeClass('hide');
          // $('#options' ).val(question2.options );
          populateOptions(question2);
        }
        $('#q_type').val(question2.qtype);
        $('#q_audience').val(question2.audience);

      }
    },
    'change .q_dataType': function (evt, tmpl) {
      var datatype = $(evt.target).val();
      if (datatype == "Multiple Select" || datatype == "Single Select") {
        $('#options,#options_label').removeClass('hide');
      } else {
        $('#options,#options_label').addClass('hide');
      }

    },
    'change .q_category': function (evt, tmpl) {
      var datatype = $(evt.target).val();
      if (datatype == "Other") {
        $('#category').removeClass('hide');
      } else {
        $('#category').addClass('hide');
      }

    },
    'change .locked': function (evt, tmpl) {
      checkLocked();
    },
    'click .save': function (evt, tmpl) {

      var q_category = tmpl.find('.q_category').value;
      if (q_category == "Other") {
        q_category = tmpl.find('.category').value;
      }
      var q_name = tmpl.find('.q_name').value;
      var question = tmpl.find('.question').value;

      var q_dataType = tmpl.find('.q_dataType').value;
      var qtype = tmpl.find('#q_type').value;
      var audience = tmpl.find('#q_audience').value;
      var locked = tmpl.find('#locked').checked;

      var isCopy = tmpl.find('#isCopy').checked;

      var options, selectstatus = false, option_array;
      options = [];
      console.log("qtype=" + qtype);
      console.log("audience=" + audience);
      if ((
            q_dataType == "Multiple Select"
          ) ||
          (
            q_dataType == "Single Select"
          )) {
        // options = tmpl.find('#options').value;
        // selectstatus=true;
        $("#aoptions").find("tr").each(
          function () {
            option_array = {};
            option_array["value"] = $(this).find(".value").val();
            option_array["description"] = $(this).find(".description").val();
            options.push(option_array);
          }
        );
      }
      else {
        options = "";
      }
      if (q_category == "") {
        $('#error').html("<b>Please select a question category</b>");
        $('#error').show();
      } else if (q_name == "") {
        $('#error').html("<b>Please enter a questions name</b>");
        $('#error').show();
      } else if (question == "") {
        $('#error').html("<b>Please enter a display text</b>");
        $('#error').show();
      } else if (q_dataType == "") {
        $('#error').html("<b>Please select a datatype</b>");
        $('#error').show();
      } else if ((
                   selectstatus
                 ) &&
                 (
                   options == ""
                 )) {
        $('#error').html("<b>Please enter options separated by commas </b>");
        $('#error').show();
      } else {
        $('#newQuestionModal').modal('hide');
        $('#error').hide();
        var isUpdate = $('#isUpdate').val();
        var questionID = $('#questionID').val();
        if (isUpdate == '1') {
          Meteor.call(
            "updateQuestion",
            questionID,
            q_category,
            q_name,
            question,
            q_dataType,
            options,
            qtype,
            audience,
            locked,
            isCopy,
            function (error, result) {
              if (error) {
                console.log(error);
              } else {
                console.log(result);
              }
            }
          );
        } else {
          Meteor.call(
            "addQuestion",
            q_category,
            q_name,
            question,
            q_dataType,
            options,
            qtype,
            audience,
            locked,
            isCopy,
            function (error, result) {
              if (error) {
                console.log(error);
              } else {
                console.log(result);
              }
            }
          );

        }
        resetQuestionModal();
      }
    },
    'click .cancel': function (evt, tmpl) {
      resetQuestionModal();
    },
    'click .close': function (evt, tmpl) {
      resetQuestionModal();
    },
    'click .remove': function (evt, tmpl) {

      var questionID = $('#questionID').val();
      Meteor.call(
        "removeQuestion", questionID, function (error, result) {
          if (error) {
            console.log(error);
          } else {
            console.log(result);
          }
        }
      );

      resetQuestionModal();
    }
  }
);

Template.questionRow.events(
  {
    'click .edit': function (evt, tmpl) {
      evt.preventDefault();
      $('#aoptions').empty();
      var txt1;
      var questionsCollection = adminCollectionObject("questions");
      var question = questionsCollection.findOne({ _id: tmpl.data._id });

      $('#q_category').val(question.category).change();
      $('#q_name').val(question.name);
      $('#question').val(question.question);
      $('#q_dataType').val(question.dataType).change();
      $('#q_type').val(question.qtype).change();
      $('#q_audience').val(question.audience).change();
      if (question.options != null) {
        optionsTag = "";
        populateOptions(question);

      }

      $('#newQuestionModal input[type=checkbox]#isCopy').attr('checked', question.isCopy);
      $('#newQuestionModal input[type=checkbox]#isCopy').prop('checked', question.isCopy);
      $('#newQuestionModal input[type=checkbox]#locked').attr('checked', question.locked);
      $('#newQuestionModal input[type=checkbox]#locked').prop('checked', question.locked);

      $('#isUpdate').val('1');
      $('#questionID').val(tmpl.data._id);

      $('.showWhenEdit').show();
      $('.showWhenNew').hide();
      if (question.locked) {
        setFields(true);
      } else {
        setFields(false);
      }
    },
    'click .delete': function (evt, tmpl) {

      Meteor.call(
        "removeQuestion", tmpl.data._id, function (error, result) {
          if (error) {
            console.log(error);
          } else {
            console.log(result);
          }
        }
      );

      resetQuestionModal();

    }
  }
);
Session.setDefault('section_id', null);
var section_id, skip_val;
Template.surveyEditTemplate.events(
  {
    'click .addQues': function (event, tmpl) {
      // if(tmpl.find('.section').value!="Other" || tmpl.find('.section').value!="sectionSelect") {
      // 	return;
      // }
      // else {
      // 	alert('Select a Section');
      // 	return false;
      // }

      var secValue = tmpl.find('.section').value;
      console.log("section value: " + secValue);
      if (secValue == 'sectionSelect') {
        alert("Please select/enter a section");
        return false;
      } else {
        Session.set('section_id', tmpl.find('.section').value);
      }
    },
    'click .addSection': function (event, tmpl) {

      var survey_title = tmpl.data.title;
      var survey_id = tmpl.data._id;
      var content = tmpl.find('.sectionName').value;
      var content_type = "section";
      var section_id = ' ';
      console.log("content: " + content);

      skip_val = tmpl.find('.showskip').checked;

      Meteor.call(
        "addSurveyQuestionMaster",
        survey_title,
        survey_id,
        section_id,
        skip_val,
        content_type,
        content,
        maxRank(survey_id),
        function (error, result) {
          if (error) {
            console.log(error);
          } else {
            console.log(result);

            section_id = result;

            if (section_id != null) {
              $("#section_val option[value='sectionSelect']").remove();
            } else {
              $("#section_val option[value='sectionSelect']").val('Select a Section');
            }

            $('#section_val').val(section_id);
            // if(section_id!=null){
            // 	$('.sectionSelect').removeClass('hide');
            // } else {
            // 	$('.sectionSelect').addClass('hide');
            // }


            // var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");
            // var section_name = surveyQuestionsMasterCollection.find({_id: section_id},{content:1,_id:0}).fetch();
            //
            // for(var i in section_name){
            // 	console.log("sec_name: " + section_id);
            // 	$('#section_val').val(section_id);
            //
            // }
            delete Session.keys['section_id'];
          }

        }
      );

      $("#sectionName").val("");

    },
    'click .addLabel': function (event, tmpl) {

      var survey_title = tmpl.data.title;
      var survey_id = tmpl.data._id;
      var content = tmpl.find('.labelName').value;
      var content_type = "labels";
      var section_id = tmpl.find('.section').value;
      console.log('section id:' + section_id);
      console.log("SEC_ID: " + Session.get('section_id'));
      var skip_val = tmpl.find('.showskip').value;

      Meteor.call(
        "addSurveyQuestionMaster",
        survey_title,
        survey_id,
        section_id,
        skip_val,
        content_type,
        content,
        maxRank(survey_id),
        function (error, result) {
          if (error) {
            console.log(error);
          } else {
            console.log(result);
          }
        }
      );


      $("#labelName").val("");
      // $("#skip_id").attr('checked',false);
      $("#section_val option[value='sectionSelect']").val('Select a Section');
    },

    'submit form': function (event, tmpl) {
      event.preventDefault();
    },
    'change .section': function (event, tmp) {
      var section = $(event.target).val();
      if (section == "Other" || section == "sectionSelect") {
        $('#sectionName').removeClass('hide');
      } else {
        $('#sectionName').addClass('hide');
      }
    }
  }
);

Template.sortableItemTarget.events(
  {
    'dblclick .name': function (event, template) {
      // Make the name editable. We should use an existing component, but it's
      // in a sorry state - https://github.com/arillo/meteor-x-editable/issues/1
      var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");
      var cont = surveyQuestionsMasterCollection.find({ _id: this._id }, { content_type: 1, _id: 0 }).fetch();
      var contentType = '';
      for (var i in cont) {
        var contentType = cont[i].content_type
      }
      if (contentType == "question") {
        alert("Question cannot be edited");
        input.hide();
        template.$('.name').show();
      } else {
        var name = template.$('.name');
        var input = template.$('input');
        if (input.length) {  // jQuery never returns null - http://stackoverflow.com/questions/920236/how-can-i-detect-if-a-selector-returns-null
          input.show();
        } else {
          input =
            $('<input class="form-control" type="text" placeholder="' + this.content + '" style="display: inline">');
          name.after(input);
        }
        name.hide();
        input.focus();
      }
    },
    'blur input[type=text]': function (event, template) {
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
      var input = template.$('input');
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
          "updateSurveyQuestionMaster", this._id, input.val(), function (error, result) {
            if (error) {
              console.log(error);
            } else {
              console.log(result);
            }
          }
        );

      }
    },
    'keydown input[type=text]': function (event, template) {
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
    'click .close': function (event, template) {
      // `this` is the data context set by the enclosing block helper (#each, here)

      Meteor.call(
        "removeSurveyQuestionMaster", this._id, function (error, result) {
          if (error) {
            console.log(error);
          } else {
            console.log(result);
          }
        }
      );

      // custom code, working on a specific collection
      var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");
      if (surveyQuestionsMasterCollection.find({}).count() === 0) {
        Meteor.setTimeout(
          function () {
            alert('Not nice to delete the entire list! Add some attributes instead.');
          }, 1000
        );
      }
    }
  }
);

Template.selectQuestions.events(
  {
    'click .selectques': function (evt, tmpl) {
      evt.preventDefault();

      var selected = tmpl.findAll("input[type=checkbox]:checked");
      var array = selected.map(
        function (item) {
          return item.value
        }
      )
      Session.set('selectedQuestions', array);
      var survey_id = tmpl.data._id;
      var survey_title = tmpl.data.title;
      var arrayLength = array.length;
      for (var i = 0; i < arrayLength; i ++) {
        array[i] = array[i].substring(0, array[i].length - 1);

      }
      console.log("Ques: " + array);
      console.log("skip val: " + skip_val);

      for (var i = 0; i < array.length; i ++) {
        Meteor.call(
          "addSurveyQuestionMaster",
          survey_title,
          survey_id,
          Session.get('section_id'),
          skip_val,
          'question',
          array[i],
          maxRank(survey_id),
          function (error, result) {
            if (error) {
              console.log(error);
            } else {
              console.log(result);
            }
          }
        );
      }

      Router.go('adminDashboardsurveysEdit', { _id: tmpl.data._id });
    }
  }
);


var skip_value, contents;
Template.previewSurvey.events(
  {

    'change .hideWhenSkipped': function (evt, tmpl) {
      var toggleSkip = $('#' + evt.target.id).is(':checked');
      if (toggleSkip) {
        $('.' + evt.target.id).hide();
      } else {
        $('.' + evt.target.id).show();
      }
    },
    'change .singleSelect': function (evt, tmpl) {

      var element = tmpl.find('input:radio[name=singleSelect]:checked');
      var optionValue = $(element).val();
      console.log("value: " + optionValue);

      if (optionValue == 'others' || optionValue == 'Others') {
        console.log("Others, please specify");
        $('.othersSpecify_single').removeClass('hide');
      } else {
        $('.othersSpecify_single').addClass('hide');
      }
    },
    'change .multipleSelect': function (evt, tmpl) {

      var element = tmpl.find('input:checkbox[name=multipleSelect]:checked');
      var optionValue = $(element).val();
      console.log("value: " + optionValue);

      if (optionValue == 'others' || optionValue == 'Others') {
        console.log("Others, please specify");
        $('.othersSpecify_multiple').removeClass('hide');
      } else {
        $('.othersSpecify_multiple').addClass('hide');
      }
    },
    'click .createSurvey': function (evt, tmpl) {

      evt.preventDefault();
      $('#confirmationModal').modal('show');
    },
    'click .save_survey': function (evt, tmpl) {

      //alert("save clicked: " + tmpl.data._id );
      var surveyID = tmpl.data._id;
      var created = true;

      Meteor.call(
        "updateCreatedSurvey", surveyID, created, function (error, result) {
          if (error) {
            console.log(error);
          } else {
            console.log(result);
          }
        }
      );
    }

  }
);

var populateOptions = function (question) {
  var optionsTag;
  for (var i in question.options) {
    if (question.options[i].description != null) {
      optionsTag =
        "<tr  id='" +
        i +
        "' class='questionRow'><td><input type='number' id='" +
        i +
        ".value' class='value' value='" +
        question.options[i].value +
        "'/></td>";
      optionsTag +=
        "<td><textarea rows='1' cols='40' id='" +
        i +
        ".description' class='description'>" +
        question.options[i].description +
        "</textarea></td>";

      optionsTag +=
        "<td><a id='delete." +
        i +
        "' class='btn btn-primary optionremove'><span class='fa fa-remove'></span></a></td></tr>";
      $('#aoptions').append(optionsTag);
      registerDeleteOption();
    }
  }

};

function registerDeleteOption() {
  $('#aoptions').on(
    'click', 'a.optionremove', function () {
      const rowId = $(this).attr('id');
      const i = rowId.split('.');
      const i1 = i[1];
      $(`#${i1}`).remove();
    }
  );
}
