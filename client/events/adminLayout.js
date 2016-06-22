Template.AdminLayout.created = () => {
  const self = this;

  self.minHeight = new ReactiveVar(
    $(window).height() - $('.main-header').height()
  );

  $(window).resize(
    () => {
      self.minHeight.set($(window).height() - $('.main-header').height());
    }
  );

  $('body').addClass('fixed');
};

Template.AdminLayout.destroyed = () => {
  $('body').removeClass('fixed');
};

Template.AdminLayout.helpers(
  {
    minHeight() {
      return `${Template.instance().minHeight.get()}px`;
    },
  }
);

Template.AdminRoleManager.onRendered(
  () => {
    $('.js-tooltip').tooltip();
  }
);
