PreliminarySurvey = {
  showDVQuestion() {
    const dvQuestionSkip = options.findOne(
      { option_name: 'preClientProfileQuestions.dvQuestion.skip' }
    );

    let flag = true;

    if (dvQuestionSkip && dvQuestionSkip.option_value) {
      flag = false;
    } else {
      $('#dvQuestionModal').modal(
        {
          keyboard: false,
          backdrop: false,
        }
      );
    }
    return flag;
  },
  showHousingSurveyQuestion() {
    const housingServiceQuestionSkip = options.findOne(
      { option_name: 'preClientProfileQuestions.housingServiceQuestion.skip' }
    );

    let flag = true;

    if (housingServiceQuestionSkip && housingServiceQuestionSkip.option_value) {
      flag = false;
    } else {
      $('#housingServiceQuestionModal').modal(
        {
          keyboard: false,
          backdrop: false,
        }
      );
    }
    return flag;
  },
  showReleaseOfInformation() {
    const releaseOfInformationSkip = options.findOne(
      { option_name: 'preClientProfileQuestions.releaseOfInformation.skip' }
    );

    let flag = true;

    if (releaseOfInformationSkip && releaseOfInformationSkip.option_value) {
      flag = false;
    } else {
      $('#releaseOfInformationModal').modal(
        {
          keyboard: false,
          backdrop: false,
        }
      );
    }
    return flag;
  },
};
