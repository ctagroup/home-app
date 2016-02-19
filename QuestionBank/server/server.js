
if (Meteor.isServer) {

    Questions = new Meteor.Collection('QuestionBank');
    Meteor.startup(function () {

        Meteor.methods({
            removeAllProjects:function(){
                Questions.remove({});
            }
        })
    });
}