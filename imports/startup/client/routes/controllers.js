import '/imports/ui/app/appLayout';
import { CollectionsCountCache } from '/imports/both/cached-subscriptions';


export const ContentController = RouteController.extend(
  {
    layoutTemplate: 'ContentLayout',
  }
);


export const AppController = RouteController.extend({
  layoutTemplate: Template.AppLayout,
  waitOn() {
    return Meteor.userId() ? CollectionsCountCache.subscribe('collectionsCount') : [];
  },
});
