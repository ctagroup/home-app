/**
 * Created by Kavi on 2/15/16.
 */
QuestionsSchema = new Meteor.Collection('questionsSchema');
if (Meteor.isClient) {
   // Session.setDefault('showQuestions',false);

    Template.surveys.events({

        'submit form':function(event,tmpl){

            event.preventDefault();


            Session.set('showQuestions',{});


            var label = event.target.survey_label.value;

            Template.getQuestions.label = label;

            event.target.survey_label.value = " ";

            return Template.getQuestions.label;


    },


    });
    Template.getQuestions.textboxString = function(data){
        if(data == "Textbox-string"){
            return true;
        }

    }
    Template.getQuestions.textboxNumber = function(data){

        if(data == "Textbox-number"){
            return true;
        }

    }
    Template.getQuestions.booleanYN = function(data){
        if(data == "Boolean-y/n"){
            return true;
        }
    }
    Template.getQuestions.booleanTF = function(data){
        if(data == "Boolean-t/f"){
            return true;
        }
    }
    Template.getQuestions.singleSelect = function(data){

        if(data == "Single select"){
            return true;

        }
    }
    Template.getQuestions.multipleSelect = function(data){

        if(data == "Multiple select"){
            return true;

        }
    }

    Template.getQuestions.quesList = function(){
        var questions = Session.get('showQuestions');
        return questions && QuestionsSchema.find(questions);

    }
    Template.surveyCreator.fetch_questions = function(){
        return Session.get('showQuestions');
    }
    Template.getQuestions.questionsList = function(){
        return QuestionsSchema.find();

    }
    Template.getQuestions.singleOptions = function(optionsVal){

        return optionsVal.split(",");

    }
    Template.getQuestions.multipleOptions = function(optionsVal){

        return optionsVal.split(",");

    }


}

