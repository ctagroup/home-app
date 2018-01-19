import { AppController } from './controllers';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import Questions from '/imports/api/questions/questions';
import '/imports/ui/questions/questionForm';


Router.route('questionsView', {
  path: '/questions',
  template: 'questionsListView',
  controller: AppController,
  authorize: {
    allow() {
      return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
    },
  },
  waitOn() {
    return Meteor.subscribe('questions.all');
  },
  data() {
    return {
      title: 'Questions',
      subtitle: 'View',
    };
  },
});

Router.route('questionsNew', {
  path: '/questions/new',
  template: Template.questionForm,
  controller: AppController,
  authorize: {
    allow() {
      return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
    },
  },
  waitOn() {
    const sourceId = Router.current().params.query.source;
    if (sourceId) {
      return Meteor.subscribe('questions.one', sourceId);
    }
    return [];
  },
  data() {
    const sourceId = Router.current().params.query.source;
    const question = Object.assign(Questions.findOne(sourceId) || {}, {
      _id: undefined,
      definition: JSON.stringify({ type: 'question', category: 'text' }),
    });

    return {
      title: 'Questions',
      subtitle: sourceId ? 'Clone' : 'New',
      question,
    };
  },
});


Router.route('questionsEdit', {
  path: '/questions/:_id/edit',
  template: Template.questionForm,
  controller: AppController,
  authorize: {
    allow() {
      return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
    },
  },
  waitOn() {
    return Meteor.subscribe('questions.all');
  },
  data() {
    const id = Router.current().params._id;
    const question = Questions.findOne(id) || {};
    return {
      title: 'Questions',
      subtitle: 'Edit',
      id,
      question,
    };
  },
});
