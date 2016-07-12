Template.AdminSettings.helpers(
  {
    getAdminSettings() {
      const settings = {};
      settings.preClientProfileQuestions = {};
      settings.preClientProfileQuestions.dvQuestion = {};
      settings.preClientProfileQuestions.housingServiceQuestion = {};
      settings.preClientProfileQuestions.releaseOfInformation = {};

      const optionsCollection = adminCollectionObject('options');

      const dvQuestion = optionsCollection.find(
        { option_name: 'preClientProfileQuestions.dvQuestion.question' }
      ).fetch();
      if (dvQuestion.length > 0 && typeof dvQuestion[0].option_value !== 'undefined') {
        settings.preClientProfileQuestions.dvQuestion.question = dvQuestion[0].option_value;
      } else {
        settings.preClientProfileQuestions.dvQuestion.question = '';
      }

      const dvQuestionSkip = optionsCollection.find(
        { option_name: 'preClientProfileQuestions.dvQuestion.skip' }
      ).fetch();
      if (dvQuestionSkip.length > 0 && typeof dvQuestionSkip[0].option_value !== 'undefined') {
        const boolean = (dvQuestionSkip[0].option_value === 'true');
        settings.preClientProfileQuestions.dvQuestion.skip = boolean;
      } else {
        settings.preClientProfileQuestions.dvQuestion.skip = '';
      }

      const hotlineInfo = optionsCollection.find(
        { option_name: 'preClientProfileQuestions.dvQuestion.hotlineInfo' }
      ).fetch();
      if (hotlineInfo.length > 0 && typeof hotlineInfo[0].option_value !== 'undefined') {
        settings.preClientProfileQuestions.dvQuestion.hotlineInfo = hotlineInfo[0].option_value;
      } else {
        settings.preClientProfileQuestions.dvQuestion.hotlineInfo = '';
      }

      const housingServiceQuestion = optionsCollection.find(
        { option_name: 'preClientProfileQuestions.housingServiceQuestion.question' }
      ).fetch();
      if (housingServiceQuestion.length > 0
        && typeof housingServiceQuestion[0].option_value !== 'undefined') {
        const question = housingServiceQuestion[0].option_value;
        settings.preClientProfileQuestions.housingServiceQuestion.question = question;
      } else {
        settings.preClientProfileQuestions.housingServiceQuestion.question = '';
      }

      const housingServiceQuestionSkip = optionsCollection.find(
        { option_name: 'preClientProfileQuestions.housingServiceQuestion.skip' }
      ).fetch();
      if (housingServiceQuestionSkip.length > 0
        && typeof housingServiceQuestionSkip[0].option_value !== 'undefined') {
        const boolean = (housingServiceQuestionSkip[0].option_value === 'true');
        settings.preClientProfileQuestions.housingServiceQuestion.skip = boolean;
      } else {
        settings.preClientProfileQuestions.housingServiceQuestion.skip = '';
      }

      const releaseOfInformation = optionsCollection.find(
        { option_name: 'preClientProfileQuestions.releaseOfInformation.info' }
      ).fetch();
      if (releaseOfInformation.length > 0
        && typeof releaseOfInformation[0].option_value !== 'undefined') {
        const info = releaseOfInformation[0].option_value;
        settings.preClientProfileQuestions.releaseOfInformation.info = info;
      } else {
        settings.preClientProfileQuestions.releaseOfInformation.info = '';
      }

      const releaseOfInformationSkip = optionsCollection.find(
        { option_name: 'preClientProfileQuestions.releaseOfInformation.skip' }
      ).fetch();
      if (releaseOfInformationSkip.length > 0
        && typeof releaseOfInformationSkip[0].option_value !== 'undefined') {
        const boolean = (releaseOfInformationSkip[0].option_value === 'true');
        settings.preClientProfileQuestions.releaseOfInformation.skip = boolean;
      } else {
        settings.preClientProfileQuestions.releaseOfInformation.skip = '';
      }

      return settings;
    },
  }
);
