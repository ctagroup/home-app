import '/imports/ui/app/appLayout';
import '/imports/ui/content/contentLayout';
import { CollectionsCountCache } from '/imports/both/cached-subscriptions';


export const ContentController = RouteController.extend({
  layoutTemplate: Template.ContentLayout,
});

export const AppController = RouteController.extend({
  layoutTemplate: Template.AppLayout,
  waitOn() {
    return Meteor.userId() ? CollectionsCountCache.subscribe('collectionsCount') : [];
  },
});
