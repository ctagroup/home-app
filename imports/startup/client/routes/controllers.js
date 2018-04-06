import '/imports/ui/app/appLayout';
import '/imports/ui/content/contentLayout';
import { CollectionsCountCache } from '/imports/both/cached-subscriptions';

Tracker.autorun(() => {
  const loggingIn = Meteor.loggingIn();
  const userId = Meteor.userId();
  console.log('bb', userId, loggingIn);
});

Tracker.autorun(() => {
  console.log('cc', Meteor.status(), new Date());
});


export const ContentController = RouteController.extend({
  layoutTemplate: Template.ContentLayout,
  waitOn() {
    console.log('aa', Meteor.user());
    return CollectionsCountCache.subscribe('appSettings');
  },
});

export const AppController = RouteController.extend({
  layoutTemplate: Template.AppLayout,
  onBeforeAction() {
    console.log('aa', Meteor.user());
    this.next();
  },
  onAfterAction() {
    console.log('aa', Meteor.user());
  },
  waitOn() {
    console.log('aa', Meteor.user());
    if (!Meteor.userId()) {
      Router.go('signIn');
    }
    return [
      Meteor.subscribe('agencies.active'),
      Meteor.subscribe('projects.all'), // TODO: only user active projects should be published
      CollectionsCountCache.subscribe('collectionsCount'),
      CollectionsCountCache.subscribe('appSettings'),
    ];
  },
});
