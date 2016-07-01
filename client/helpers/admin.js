/**
 * Created by udit on 10/02/16.
 */
Template.AdminRoleManager.helpers(
  {
    getHomeRoles() {
      return homeRoles.find({}).fetch();
    },
    getPermissions() {
      let permissions = Roles.getAllRoles().fetch();
      let roles = homeRoles.find({}).fetch();
      roles = $.map(
        roles, (role) => role.title
      );
      permissions = $.grep(
        permissions, (p) => $.inArray(p.name, roles) < 0
      );
      return permissions;
    },
    isPermissionInRole(permission) {
      const rolePermissionsCollection = adminCollectionObject('rolePermissions');
      const result = rolePermissionsCollection.find(
        { role: this.title, permission, value: true }
      ).fetch();
      if (result.length > 0) {
        return 'checked';
      }
      return '';
    },
  }
);


Template.AdminSettings.helpers(
  {
    getAdminSettings() {
      const settings = {};

      settings.hmisAPI = {};

      const optionsCollection = adminCollectionObject('options');
      const trustedAppID = optionsCollection.find({ option_name: 'trustedAppID' }).fetch();
      if (trustedAppID.length > 0 && typeof trustedAppID[0].option_value !== 'undefined') {
        settings.hmisAPI.trustedAppID = trustedAppID[0].option_value;
      } else {
        settings.hmisAPI.trustedAppID = '';
      }

      const trustedAppSecret = optionsCollection.find({ option_name: 'trustedAppSecret' }).fetch();
      if (trustedAppSecret.length > 0 && typeof trustedAppSecret[0].option_value !== 'undefined') {
        settings.hmisAPI.trustedAppSecret = trustedAppSecret[0].option_value;
      } else {
        settings.hmisAPI.trustedAppSecret = '';
      }

      return settings;
    },
  }
);

UI.registerHelper(
  'currentUserCan', (cap) => Roles.userIsInRole(Meteor.user(), cap)
);

Template.registerHelper(
  'formatDate', (date) => moment(date).format('MM/DD/YYYY')
);

Template.registerHelper(
  'my_console_log', (data) => {
    logger.log(data);
  }
);

Template.surveyViewTemplate.helpers(
  {
    surveyList() {
      const surveyCollection = adminCollectionObject('surveys');
      return surveyCollection.find({}).fetch();
    },
  }
);
Template.surveyForm.helpers(
  {
    surveyList() {
      const surveyCollection = adminCollectionObject('surveys');
      return surveyCollection.find({}).fetch();
    },
  }
);

Template.surveyEditTemplate.helpers(
  {
    questionList() {
      const questionCollection = adminCollectionObject('questions');
      return questionCollection.find({}).fetch();
    },
    existingSelectedQuestions() {
      const qIds = Session.get('selectedQuestions');
      return qIds != null;
    },
    getSection() {
      const surveyQuestionsMasterCollection = adminCollectionObject('surveyQuestionsMaster');
      const distinctEntries = _.uniq(
        surveyQuestionsMasterCollection.find(
          {
            contentType: 'section',
            surveyID: Router.current().params._id,
          },
          {
            sort: { content: 1 },
            fields: { content: true },
          }
        ).fetch().reverse()
      );
      return distinctEntries;
    },
  }
);

Template.questionViewTemplate.helpers(
  {
    questionList() {
      const questionCollection = adminCollectionObject('questions');
      return questionCollection.find({}).fetch();
    },
  }
);

Template.questionForm.helpers(
  {
    questionList() {
      const questionCollection = adminCollectionObject('questions');
      return questionCollection.find({}).fetch();
    },
    getQuestionCategory() {
      const questionCollection = adminCollectionObject('questions');
      const distinctEntries = _.uniq(
        questionCollection.find(
          {},
          { sort: { category: 1 }, fields: { category: true } }
        ).fetch().map(
          (x) => x.category
        ), true
      );
      return distinctEntries;
    },
  }
);

Template.surveyRow.helpers(
  {
    editSurveyPath(id) {
      return Router.path(`adminDashboard${Session.get('admin_collection_name')}Edit`, { _id: id });
    },
  }
);

Template.sortableItemTarget.helpers(
  {
    notQuestion(type) {
      return !(String(type) === String('question'));
    },
    quesName(qId) {
      const questionCollection = adminCollectionObject('questions');
      const question = questionCollection.findOne({ _id: qId });

      return `<strong>Name:</strong> ${question.name}`;
    },
    quesLabel(qId) {
      const questionCollection = adminCollectionObject('questions');
      const question = questionCollection.findOne({ _id: qId });

      return `<strong>Label:</strong> ${question.question}`;
    },
  }
);

Template.typeDefinition.helpers(
  {
    showPreview() {
      const surveyQuestionsMasterCollection = adminCollectionObject('surveyQuestionsMaster');
      if (
        surveyQuestionsMasterCollection.find(
          { surveyID: Router.current().params._id }
        ).count()
        > 0
      ) {
        return true;
      }
      return false;
    },
    attributes() {
      const surveyQuestionsMasterCollection = adminCollectionObject('surveyQuestionsMaster');
      return surveyQuestionsMasterCollection.find(
        { surveyID: Router.current().params._id }, {
          sort: { order: 1 },
        }
      );
    },
    attributesOptions: {
      group: {
        name: 'typeDefinition',
        put: true,
      },
      // event handler for reordering attributes
      onSort(event) {
        logger.log(`Item ${event.data.name} went from #${event.oldIndex} to #${event.newIndex}`);
      },
    },
  }
);

Session.setDefault('selectedQuestions', null);

Template.selectQuestions.helpers(
  {
    questionList() {
      const questionCollection = adminCollectionObject('questions');
      const surveysCollection = adminCollectionObject('surveys');
      const survey = surveysCollection.findOne({ _id: Router.current().params._id });
      logger.log(`survey type=${survey.stype}`);
      logger.log(`survey id to select questions=${Router.current().params._id}`);
      return questionCollection.find({ qtype: survey.stype }).fetch();
    },
  }
);

Template.previewSurvey.helpers(
  {
    editSurveyPath(id) {
      return Router.path('adminDashboardsurveysEdit', { _id: id });
    },
    surveyQuesContents() {
      const surveyQuestionsMasterCollection = adminCollectionObject('surveyQuestionsMaster');
      logger.log(Router.current().params._id);
      logger.log(
        surveyQuestionsMasterCollection.find(
          { surveyID: Router.current().params._id },
          { sort: { order: 1 } }
        ).fetch()
      );
      return surveyQuestionsMasterCollection.find(
        { surveyID: Router.current().params._id },
        { sort: { order: 1 } }
      ).fetch();
    },
    displaySection(contentType) {
      return contentType === 'section';
    },
    displayLabel(contentType) {
      return contentType === 'labels';
    },
    displaySkipButton(contentType, allowSkip) {
      return contentType === 'section' && allowSkip === 'true';
    },
    booleanYN(data) {
      return data === 'Boolean';
    },
    displayQues(contentType) {
      return contentType === 'question';
    },
    displayQuesContents(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const question = questionCollection.findOne({ _id: contentQuesId });

      return question.question;
    },
    textboxString(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const question = questionCollection.findOne({ _id: contentQuesId });

      return question.dataType === 'Textbox(String)';
    },
    textboxNumber(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const question = questionCollection.findOne({ _id: contentQuesId });

      return question.dataType === 'Textbox(Integer)';
    },
    booleanTF(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const question = questionCollection.findOne({ _id: contentQuesId });

      return question.dataType === 'Boolean';
    },
    singleSelect(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const question = questionCollection.findOne({ _id: contentQuesId });

      return question.dataType === 'Single Select';
    },
    singleOptions(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const question = questionCollection.findOne({ _id: contentQuesId });

      return question.options;
    },
    multipleSelect(contentQuesId) {
      const questionCollection = adminCollectionObject('questions');
      const question = questionCollection.findOne({ _id: contentQuesId });

      return question.dataType === 'Multiple Select';
    },
  }
);

Template.AdminDashboardusersEdit.helpers(
  {
    getOtherRoles(userId) {
      return HomeHelpers.getOtherRoles(userId);
    },
    getUserRoles(userId) {
      return HomeHelpers.getUserRoles(userId);
    },
  }
);

