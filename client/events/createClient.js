Template.createClient.onRendered(() => {
  const template = Template.instance();
  template.autorun(() => {
    var dvQuestionSkip = options.findOne({option_name:'preClientProfileQuestions.dvQuestion.skip'});

    if(dvQuestionSkip && dvQuestionSkip.option_value) {

    } else {
      $('#dvQuestionModal').modal(
        {
          keyboard: false,
          backdrop: false,
        }
      );
    }
  });

});
