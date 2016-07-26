Template.AdminLayout.onCreated(
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
