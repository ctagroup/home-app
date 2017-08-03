import { CollectionsCountCache } from '/imports/both/cached-subscriptions';


export const ContentController = RouteController.extend(
  {
    layoutTemplate: 'ContentLayout',
  }
);


export const AppController = RouteController.extend({
  layoutTemplate: 'AppLayout',
  waitOn() {
    console.warn('TODO: enable collectionsCount sub');
    return [];
    // return Meteor.userId() ? CollectionsCountCache.subscribe('collectionsCount') : [];
  },
  onBeforeAction() {
    Session.set('adminSuccess', null);
    Session.set('adminError', null);
    Session.set('admin_title', '');
    Session.set('admin_subtitle', '');
    Session.set('admin_collection_page', null);
    Session.set('admin_collection_name', null);
    Session.set('admin_id', null);
    Session.set('admin_doc', null);

    Meteor.call('checkDevUser');

    this.next();
  },
});
