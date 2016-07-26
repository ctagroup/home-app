/**
 * Created by udit on 02/07/16.
 */

Template.AdminSidebar.onCreated(
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

Template.AdminSidebar.events(
  {
    'click .js-logout'() {
      if (Meteor.userId()) {
        AccountsTemplates.logout();
      }
    },
  }
);
