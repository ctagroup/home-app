/**
 * Created by Kavi on 2/15/16.
 */
 QuestionsSchema = new Meteor.Collection('questionsSchema');
 SurveyQuestionsSchema = new Meteor.Collection('surveyQuesSchema');
 if (Meteor.isClient) {

   Session.setDefault('fetch_surveyQues',null)
   Session.setDefault('showSection',false);
   Session.setDefault('showLabel',false);
   var label,q_ids,content,sectionRank,rank,survey_title,survey_id,order1,maxRank;

   Template.surveyCreator.events({

    'click .addSection':function(event,tmpl){

      survey_title = tmpl.data.survey_title;
      survey_id = tmpl.data._id;
      content = tmpl.find('.sectionName').value;
      content_type= "section";   
              //alert("order:" + maxRank());
      
              insertSurveyQues(survey_title,survey_id,content_type,content,maxRank());

              //alert(survey_title+" "+ survey_id+ " " + content_type +" "+content+" " + maxRank()); 
              $("#sectionName").val("");

            },
            'click .addLabel':function(event,tmpl){

              survey_title = tmpl.data.survey_title;
              survey_id = tmpl.data._id;
              content = tmpl.find('.labelName').value;
              content_type= "label"; 
            //order = SurveyQuestionsSchema.find({survey_id:survey_id, {sort: {order: -1}})+1;
            insertSurveyQues(survey_title,survey_id,content_type,content,maxRank()); 

            //alert(survey_title+" "+ survey_id+ " " + content_type +" "+content+" " + maxRank());    
            $("#labelName").val("");     
          },

          'submit form':function(event,tmpl){

            event.preventDefault();
            Session.set('showQuestions',{});
          },
        });

        Template.surveyCreator.existingSelectedQuestions=function(){

          q_ids=Session.get('selectedQuestions');

          if(q_ids!=null)
            return true;
          else
            return false;
        }

        Template.sortableItemTarget.notQuestion = function(type){

          if(type == "question")
            return false
          else
            return true;    
        } 
        Template.typeDefinition.showPreview = function(){

          if(SurveyQuestionsSchema.find({survey_id:Router.current().params._id}).count()>0){
            return true;
          }
        }  
        Template.sortableItemTarget.quesNames = function(content){

         var questionName = Questions.find({_id:content},{q_name:1,_id:0}).fetch();

         for(var i in questionName){
          var qNames = questionName[i].q_name;
        }
        return qNames;

        }
        var insertSurveyQues = function(survey_title,survey_id,content_type,content,rank){

          SurveyQuestionsSchema.insert({survey_id:survey_id,survey_title:survey_title,content_type:content_type,content:content,order:rank});
          Session.set('selectedQuestions',null);
        }
        var maxRank = function(){
          if(SurveyQuestionsSchema.find({survey_id:survey_id}).count()<=0){
            return 0;
          }
          else{
           order1 = SurveyQuestionsSchema.find({survey_id:survey_id},{sort: {order: -1}}).fetch();
           for(var i in order1){

            var maxOrder = order1[0].order + 1;
            //console.log("order:" +maxOrder);
          }
          return maxOrder;
        }   
        }

        // Define an object type by dragging together attributes

        Template.typeDefinition.helpers({

          attributes: function () {
            return SurveyQuestionsSchema.find({survey_id:Router.current().params._id}, {
              sort: { order: 1 }
            });
          },
          attributesOptions: {
            group: {
              name: 'typeDefinition',
              put: true
            },
            // event handler for reordering attributes
            onSort: function (event) {
              console.log('Item %s went from #%d to #%d',
                event.data.name, event.oldIndex, event.newIndex
                );
            }
          }
        });

        Template.sortableItemTarget.events({
          'dblclick .name': function (event, template) {
            // Make the name editable. We should use an existing component, but it's
            // in a sorry state - https://github.com/arillo/meteor-x-editable/issues/1
            var cont = SurveyQuestionsSchema.find({_id:this._id},{content_type:1,_id:0}).fetch();
              for(var i in cont){
                    var contentType = cont[i].content_type
                  }
              if(contentType == "question"){
                alert("Question cannot be edited");
                input.hide();
                 template.$('.name').show();
              }else{
            var name = template.$('.name');
            var input = template.$('input');
            if (input.length) {  // jQuery never returns null - http://stackoverflow.com/questions/920236/how-can-i-detect-if-a-selector-returns-null
              input.show();
            } else {
              input = $('<input class="form-control" type="text" placeholder="' + this.content + '" style="display: inline">');
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
            if (this.name !== input.val() && this.name !== ''){
            //   var cont = SurveyQuestionsSchema.find({_id:this._id},{content_type:1,_id:0}).fetch();
            //   for(var i in cont){
            //         var contentType = cont[i].content_type
            //       }
            //   if(contentType == "question"){
            //     alert("Question cannot be edited");
            //   }else{
              SurveyQuestionsSchema.update({_id:this._id}, {$set: {content: input.val()}});
            
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
          }
        });

        // you can add events to all Sortable template instances
        Template.sortable.events({
          'click .close': function (event, template) {
            // `this` is the data context set by the enclosing block helper (#each, here)
            template.collection.remove(this._id);
            // custom code, working on a specific collection
            if (SurveyQuestionsSchema.find().count() === 0) {
              Meteor.setTimeout(function () {
                SurveyQuestionsSchema.insert({
                  name: 'Not nice to delete the entire list! Add some attributes instead.',
                  order: 0
                })
              }, 1000);
            }
          }
        });
}
