import '/imports/ui/app/appLayout';
import '/imports/ui/content/contentLayout';
import { CollectionsCountCache } from '/imports/both/cached-subscriptions';


export const ContentController = RouteController.extend({
  layoutTemplate: Template.ContentLayout,
  waitOn() {
    return CollectionsCountCache.subscribe('appSettings');
  },
});

export const AppController = RouteController.extend({
  layoutTemplate: Template.AppLayout,
  onBeforeAction() {
    this.next();
  },
  waitOn() {
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
