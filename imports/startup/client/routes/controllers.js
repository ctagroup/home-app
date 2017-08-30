import '/imports/ui/app/appLayout';
import { CollectionsCountCache } from '/imports/both/cached-subscriptions';
import '/imports/ui/app/appLayout';
import '/imports/ui/content/contentLayout';

export const ContentController = RouteController.extend({
  layoutTemplate: Template.ContentLayout,
});


export const AppController = RouteController.extend({
  layoutTemplate: Template.AppLayout,
  waitOn() {
    return Meteor.userId() ? CollectionsCountCache.subscribe('collectionsCount') : [];
  },
});
