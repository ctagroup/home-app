PreliminarySurvey = {
  showPreliminarySurvey() {
    let flag = false;

    if (PreliminarySurvey.showDVQuestion() || PreliminarySurvey.showHousingSurveyQuestion()) {
      $('#preliminarySurveyModal').modal(
        {
          keyboard: false,
          backdrop: false,
        }
      );
      flag = true;
    }

    return flag;
  },
  showDVQuestion() {
    const dvQuestionSkip = options.findOne(
      { option_name: 'preClientProfileQuestions.dvQuestion.skip' }
    );

    let flag = true;

    if (dvQuestionSkip && dvQuestionSkip.option_value) {
      flag = false;
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
      SignaturePadConfig.resizeCanvas();
    }
    return flag;
  },
};
