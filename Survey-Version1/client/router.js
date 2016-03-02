 if (Meteor.isClient){
 	Router.route('/questions',function(){
        this.render('questions');
    });
    Router.route('/select_questions/:_id',{
        name:'selectquestions',
        data: function(){
            var surveyRecords = this.params._id;
            //console.log(this.params._id);
            return SurveysSchema.findOne({_id:surveyRecords});

         //this.render('surveyCreator');
     }
    });
    Router.route('/',function(){
        this.render('surveyManager');
    });
    
    Router.route('/surveyCreator/:_id',{
        name:'surveyCreator',
        data: function(){
            var surveyRecords = this.params._id;
            //console.log(this.params._id);
            return SurveysSchema.findOne({_id:surveyRecords});

         //this.render('surveyCreator');
     }
    });
      Router.route('/previewSurvey/:_id',{
        name:'previewSurvey',
        data: function(){
            var surveyRecords = this.params._id;
            //console.log(this.params._id);
            return SurveysSchema.findOne({_id:surveyRecords});

         //this.render('surveyCreator');
     }
    });
 }

 