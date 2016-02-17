if (Meteor.isServer) {

    SurveysSchema = new Meteor.Collection('surveysSchema');
    QuestionsSchema = new Meteor.Collection('questionsSchema');
    Meteor.startup(function(){
        Meteor.methods({
            removeAllSurveys:function(){
                SurveysSchema.remove({});
            },
            insertRecords:function(){
                    QuestionsSchema.insert({});
                },
            removeAllQuestions:function(){
                QuestionsSchema.remove({});
            }

        })

    });
}