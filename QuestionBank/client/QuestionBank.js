Questions = new Meteor.Collection('QuestionBank');
if (Meteor.isClient) {

    Session.setDefault('appName','Surveys');
    Session.setDefault('showQuestionDialog',false);
    Session.setDefault('editing_question',null);
    Session.setDefault('isCopy',false);
    Router.route('/',function(){
        this.render('homepage');
    });
    Router.route('/questions',function(){
        this.render('questions');
    });

    Template.menu.appName = function(){
        return Session.get('appName');

    };
    Template.questions.questionList = function(){

        return Questions.find();
    };
    Template.questionForm.events({
        'click .toggle': function(evt,tmpl) {
            var isCopy = tmpl.find('#isCopy').checked;
            if(isCopy){
                Session.set('isCopy',true);
            }else{
                Session.set('isCopy',false);
            }

        },
        'change .q_copy' : function(evt,tmpl){
            var q_cop=tmpl.find('.q_copy').value;
            var question2 = Questions.findOne({q_name:q_cop});
            document.getElementById('q_name').value="copied text";
            document.getElementById('question').value="copied";
        },
        'change .locked' : function(evt,tmpl){
            checkLocked();
        },
        'click .save':function(evt,tmpl){
            evt.preventDefault();
            var q_name = tmpl.find('.q_name').value;
            var question = tmpl.find('.question').value;
            var q_dataType = tmpl.find('.q_dataType').value;
            var hud = tmpl.find('#hud').checked;
            var reportable = tmpl.find('#reportable').checked;
            var locked = tmpl.find('#locked').checked;
            var isCopy = tmpl.find('#isCopy').checked;

            if(Session.get('editing_question')){
                updateQuestion(q_name,question,q_dataType,hud,reportable,locked,isCopy);
            }else{
                addQuestion(q_name,question,q_dataType,hud,reportable,locked,isCopy);
            }

            Session.set('showQuestionDialog',false);
            Session.set('editing_question',null);
            Session.set('isCopy',false);

        },
        'click .cancel':function(evt,tmpl){
            Session.set('showQuestionDialog',false);
            Session.set('editing_question',null);
            Session.set('isCopy',false);
        },
        'click .close':function(evt,tmpl){
            Session.set('showQuestionDialog',false);
            Session.set('editing_question',null);
            Session.set('isCopy',false);
        },
        'click .remove':function(evt,tmpl){
            removeQuestion();
            Session.set('showQuestionDialog',false);
            Session.set('editing_question',null);
        }
    });
    Template.questions.events({
        'click .addQuestion':function(evt,tmpl){
            Session.set('showQuestionDialog',true);
        }
    });
    Template.questionForm.rendered = function(){
        var question1 = Questions.findOne({_id:Session.get('editing_question')});
        if(question1!=null){
            $('.q_dataType').val(question1.q_dataType);
            if(question1.isCopy) {
                Session.set('isCopy', true);
            }
            else{
                Session.set('isCopy',false);
            }
        }
    };
    Template.questionRow.events({
        'click .edit':function(evt,tmpl){
            Session.set('editing_question',tmpl.data._id);
            Session.set('showQuestionDialog',true);
        },
        'click .delete':function(evt,tmpl){
            deleteQuestion(tmpl.data._id);
            Session.set('showQuestionDialog',false);
            Session.set('editing_question',null);
        }
    });
    Template.questionForm.currquestion = function(){
        return Questions.findOne({_id:Session.get('editing_question')});
    };
    Template.questionForm.editing_question = function(){
        return Session.get('editing_question');
    };
    Template.questionForm.isCopySet = function(){
        return Session.get('isCopy');
    };
    Template.questions.showQuestionDialog = function(){
        return Session.get('showQuestionDialog');
    };
    Template.questionForm.getQuestions=function(){
        return Questions.find();
    };

    var addQuestion = function(q_name,question,q_dataType,hud,reportable,locked,isCopy){
        var creation_date=moment(new Date()).format('MM-DD-YYYY');
        var updated_date=moment(new Date()).format('MM-DD-YYYY');
        Questions.insert({q_name:q_name,question:question,date_updated:updated_date,date_created:creation_date,q_dataType:q_dataType,hud:hud,reportable:reportable,locked:locked,isCopy:isCopy});
    };
    var updateQuestion = function(q_name,question,q_dataType,hud,reportable,locked,isCopy){
        var updated_date=moment(new Date()).format('MM/DD/YYYY');
        Questions.update(Session.get('editing_question'), {$set: {q_name:q_name,question:question,date_updated:updated_date,q_dataType:q_dataType,hud:hud,reportable:reportable,locked:locked,isCopy:isCopy}});
        return true;
    };
    var removeQuestion = function(){
        Questions.remove({_id:Session.get('editing_question')});
    };
    var deleteQuestion = function(id){
        Questions.remove({_id:id});
    };
    var checkLocked=function(){
        var toggle = document.getElementById("locked").checked;
        if(toggle){
           setFields(true);
        }else{
            setFields(false);
        }
    };
    var setFields=function(status){
        $('#isCopy').attr('disabled', status);
        $('#q_copy').attr('disabled', status);
        $('#q_category').attr('disabled', status);
        $('#q_category').attr('disabled', status);
        $('#q_name').attr('disabled', status);
        $('#question').attr('disabled', status);
        $('#hud').attr('disabled', status);
        $('#reportable').attr('disabled', status);
        $('#q_dataType').attr('disabled', status);
    };
}

