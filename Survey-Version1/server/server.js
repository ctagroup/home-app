if (Meteor.isServer) {

    SurveysSchema = new Meteor.Collection('surveysSchema');
    QuestionsSchema = new Meteor.Collection('questionsSchema');
    SurveyQuestionsSchema = new Meteor.Collection('surveyQuesSchema');
    Questions = new Meteor.Collection('QuestionBank');
   // Sortable.collections = ['surveyQuesSchema'];
    Meteor.startup(function(){
        Meteor.methods({
            // removeAllSurveys:function(){
            //     SurveysSchema.remove({});
            // },
            insertRecords:function(){
                QuestionsSchema.insert({});
            },
            // removeAllQuestions:function(){
            //     QuestionsSchema.remove({});
            // },
             insertSQues:function(){
                SurveyQuestionsSchema.insert({});
            },
            removeAllSQues:function(){
                SurveyQuestionsSchema.remove({});
            },
            //  removeAllProjects:function(){
            //     Questions.remove({});
            // }
            sort:function(){
                SurveyQuestionsSchema.find().sort({"rank":1});
            },
            rename:function(){
                SurveyQuestionsSchema.update({},{$rename:{'rank':'order'}},{multi:true});
            }

        })

    });
}