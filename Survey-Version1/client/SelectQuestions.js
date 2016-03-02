
if (Meteor.isClient) {
    Session.setDefault('selectedQuestions',null);

 Template.selectquestions.questionList = function(){
        return Questions.find();
    };
 var maxRank = function(){
    if(SurveyQuestionsSchema.find().count()<=0){
            return 0;
     }
     else{
        order1 = SurveyQuestionsSchema.find({survey_id:Router.current().params._id},{sort: {order: -1}}).fetch();
        for(var i in order1){

            var maxOrder = order1[0].order + 1;
            //console.log("order:" +maxOrder);
          }
          return maxOrder;
        }   
    }    
    Template.selectquestions.events({
        'click .selectques':function(evt,tmpl){
            evt.preventDefault();

         var selected = tmpl.findAll( "input[type=checkbox]:checked");
         var array = selected.map(function(item){ return item.value}) 
         Session.set('selectedQuestions',array);
         var survey_id = tmpl.data._id;
         var survey_title = tmpl.data.survey_title;
        // alert(survey_id + " " + survey_title);
         var arrayLength = array.length;
        for (var i = 0; i < arrayLength; i++) {
           array[i] = array[i].substring(0, array[i].length - 1);
           //console.log(q_ids[i]);
        }

         for(var i =0;i<array.length;i++){
                SurveyQuestionsSchema.insert({survey_id:survey_id,survey_title:survey_title,content_type:'question',content:array[i],order:maxRank()});
         }
        
        Router.go('/surveyCreator/'+tmpl.data._id);
}
})
}