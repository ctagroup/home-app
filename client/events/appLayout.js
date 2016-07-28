Template.AppLayout.onCreated(
  () => {
    const self = Template.instance();

    self.minHeight = new ReactiveVar(
      $(window).height() - $('.main-header').height()
    );

    $(window).resize(
      () => {
        self.minHeight.set($(window).height() - $('.main-header').height());
      }
    );
  }
);

Template.AppLayout.events({
  'click .btn-delete': (e) => {
    const _id = $(e.target).attr('doc');
    if (Session.equals('admin_collection_name', 'Users')) {
      Session.set('admin_id', _id);
      Session.set('admin_doc', Meteor.users.findOne(_id));
    }
    Session.set('admin_id', HomeUtils.parseID(_id));
    const collection = Session.get('admin_collection_name');
    const collectionObject = HomeUtils.adminCollectionObject(collection);
    Session.set('admin_doc', collectionObject.findOne(HomeUtils.parseID(_id)));
  },
});
