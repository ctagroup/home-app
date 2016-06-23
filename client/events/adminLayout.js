Template.AdminLayout.onCreated(() => {
  const self = Template.instance();

  self.minHeight = new ReactiveVar(
    $(window).height() - $('.main-header').height()
  );

  $(window).resize(
    () => {
      self.minHeight.set($(window).height() - $('.main-header').height());
    }
  );
});

Template.AdminLayout.destroyed = () => {
  $('body').removeClass('fixed');
};

Template.AdminLayout.helpers(
  {
    minHeight() {
      const height = (Template.instance().minHeight) ?
                     `${Template.instance().minHeight.get()}px` : '100%';
      return height;
    },
  }
);

Template.AdminRoleManager.onRendered(
  () => {
    $('.js-tooltip').tooltip();
  }
);
