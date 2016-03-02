   if (Meteor.isClient) {

   var quesContent;
   Template.displayContents.surveyQuesContents = function(){

    //return SurveyQuestionsSchema.find().sort({"rank":1}).fetch();
    //return SurveyQuestionsSchema.find();

     return SurveyQuestionsSchema.find({survey_id:Router.current().params._id}, {sort: {order: 1}});
   }
   Template.displayContents.textboxString = function(data){
    
        if(data == "Textbox(String)"){
            return true;
        }

    }
    Template.displayContents.displaySection = function(content_type){
            console.log(content_type);
         if(content_type == "section"){
                return true;
            }
    }
    Template.displayContents.displayLabel = function(content_type){
          console.log(content_type);
          if(content_type == "label"){
                return true;
            }
    }
    Template.displayContents.textboxNumber = function(data){

        if(data == "Textbox(Integer)"){
            return true;
        }

    }
    Template.displayContents.booleanYN = function(data){
        if(data == "Boolean"){
            return true;
        }
    }
    Template.displayContents.booleanTF = function(data){
        if(data == "Boolean"){
            return true;
        }
    }
    Template.displayContents.singleSelect = function(data){

        if(data == "Single Select"){
            //Template.getQuestions.elemOptions(options);
            return true;

        }
    }
    Template.displayContents.multipleSelect = function(data){

        if(data == "Multiple Select"){
    
            return true;

        }
    }
  
    Template.displayContents.displayQues = function(content_type,content){
    console.log(content_type);
    quesContent = content;

     if(content_type == "question"){
      return true;
     
     }
  }
    Template.displayContents.displayQuesContents = function(contentQuesId){

        console.log(contentQuesId);
         var questions = Questions.find({_id:contentQuesId}).fetch();
         //console.log("Q:" + questions);

         for(var i in questions){
            var qNames = questions[i].question;
       }
       console.log("QContent:" + qNames);
       return qNames;

       // return questions;

    }
    Template.displayContents.textboxString = function(contentQuesId){
        var questions = Questions.find({_id:contentQuesId},{q_dataType:1,_id:0}).fetch();
        
        for(var i in questions){
            var textboxString = questions[i].q_dataType;
            if(textboxString == "Textbox(String)"){
                    return true;
            }
       }
    }
    Template.displayContents.textboxNumber = function(contentQuesId){
        var questions = Questions.find({_id:contentQuesId},{q_dataType:1,_id:0}).fetch();
       
        for(var i in questions){
            var textboxNumber = questions[i].q_dataType;
            if(textboxNumber == "Textbox(Integer)"){
                    return true;
            }
       }
    }
    Template.displayContents.booleanTF = function(contentQuesId){
        var questions = Questions.find({_id:contentQuesId},{q_dataType:1,_id:0}).fetch();
       
        for(var i in questions){
            var bool = questions[i].q_dataType;
            if(bool == "Boolean"){
                    return true;
            }
       }
    }
     Template.displayContents.singleSelect = function(contentQuesId){
        var questions = Questions.find({_id:contentQuesId},{q_dataType:1,_id:0}).fetch();
       
        for(var i in questions){
            var singleSelect = questions[i].q_dataType;
            if(singleSelect == "Single Select"){
                    return true;
            }
       }
    }
  
    Template.displayContents.singleOptions = function(contentQuesId){

        var questions = Questions.find({_id:contentQuesId},{q_dataType:1,_id:0}).fetch();
       
        for(var i in questions){
            var singleSelect = questions[i].q_dataType;
            if(singleSelect == "Single Select"){
                     console.log("SINGLE: " +questions[i].options.split(","))   
                    return questions[i].options.split(",");
            }
       }
        //return optionsVal.split(",");

    }
       Template.displayContents.multipleSelect = function(contentQuesId){
        var questions = Questions.find({_id:contentQuesId},{q_dataType:1,_id:0}).fetch();
       
        for(var i in questions){
            var multipleSelect = questions[i].q_dataType;
            if(multipleSelect == "Multiple Select"){
                    return true;
            }
       }
    }
    Template.displayContents.multipleOptions = function(contentQuesId){

           var questions = Questions.find({_id:contentQuesId},{q_dataType:1,_id:0}).fetch();
       
        for(var i in questions){
            var multipleSelect = questions[i].q_dataType;
            if(multipleSelect == "Multiple Select"){
                console.log("MULTIPLE: " + questions[i].options.split(","));
                    return questions[i].options.split(",");
            }
       }  

    }
  
}
