Template.preliminarySurvey.events(
  {
    'click .js-open-hotline-info': (event) => {
      event.preventDefault();
      $('#hotlineInfoModal').modal(
        {
          keyboard: false,
          backdrop: false,
        }
      );
    },
    'click .js-close-dv-question-modal': (event) => {
      event.preventDefault();
      $('#dvQuestionModal').modal('hide');
    },
    'click .js-open-housing-service-question-modal': (event) => {
      event.preventDefault();
      if (!PreliminarySurvey.showHousingSurveyQuestion()) {
        PreliminarySurvey.showReleaseOfInformation();
      }
    },
    'click .js-close-hotline-info': (event) => {
      event.preventDefault();
      $('#hotlineInfoModal').modal('hide');
    },
    'click .js-close-housing-service-question-modal': (event) => {
      event.preventDefault();
      $('#housingServiceQuestionModal').modal('hide');
    },
    'click .js-goto-home': (event) => {
      event.preventDefault();
      Router.go('root');
    },
    'click .js-open-release-of-info-modal': (event) => {
      event.preventDefault();
      PreliminarySurvey.showReleaseOfInformation();
    },
  }
);
