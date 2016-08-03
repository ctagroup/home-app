Template.preliminarySurvey.helpers(
  {
    skipDvQuestion() {
      const dvQuestion = options.findOne(
        { option_name: 'preClientProfileQuestions.dvQuestion.skip' }
      );

      let skip = false;

      if (dvQuestion && dvQuestion.option_value) {
        skip = (dvQuestion.option_value === 'true');
      }

      return skip;
    },
    dvQuestion() {
      const dvQuestion = options.findOne(
        { option_name: 'preClientProfileQuestions.dvQuestion.question' }
      );

      let question = '';

      if (dvQuestion && dvQuestion.option_value) {
        question = dvQuestion.option_value;
      }

      return question;
    },
    skipHousingServiceQuestion() {
      const housingServiceQuestion = options.findOne(
        { option_name: 'preClientProfileQuestions.housingServiceQuestion.skip' }
      );

      let skip = false;

      if (housingServiceQuestion && housingServiceQuestion.option_value) {
        skip = (housingServiceQuestion.option_value === 'true');
      }

      return skip;
    },
    housingServiceQuestion() {
      const housingServiceQuestion = options.findOne(
        { option_name: 'preClientProfileQuestions.housingServiceQuestion.question' }
      );

      let question = '';

      if (housingServiceQuestion && housingServiceQuestion.option_value) {
        question = housingServiceQuestion.option_value;
      }

      return question;
    },
    hotlineInfo() {
      const hotlineInfo = options.findOne(
        { option_name: 'preClientProfileQuestions.dvQuestion.hotlineInfo' }
      );

      let info = '';

      if (hotlineInfo && hotlineInfo.option_value) {
        info = hotlineInfo.option_value;
      }

      return info;
    },
    releaseOfInformation() {
      const releaseofInfo = options.findOne(
        { option_name: 'preClientProfileQuestions.releaseOfInformation.info' }
      );

      let info = '';

      if (releaseofInfo && releaseofInfo.option_value) {
        info = releaseofInfo.option_value;
      }

      return info;
    },
  }
);
