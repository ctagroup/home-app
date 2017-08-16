import { CollectionsCountCache } from '/imports/both/cached-subscriptions';


export const ContentController = RouteController.extend(
  {
    layoutTemplate: 'ContentLayout',
  }
);


export const AppController = RouteController.extend({
  layoutTemplate: 'AppLayout',
  waitOn() {
    return Meteor.userId() ? CollectionsCountCache.subscribe('collectionsCount') : [];
  },
});
