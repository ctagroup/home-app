import './appHeader';
import './appSidebar';
import './appDeleteModal';
import './appLayout.html';

Template.AppLayout.helpers({
});

Template.AppLayout.events({
  'click .main-sidebar .sidebar-menu li a': () => {
    if (!$('body').hasClass('sidebar-collapse') && is.mobile()) {
      $('a[data-toggle="offcanvas"]').click();
    }
  },
});

Template.AppLayout.onRendered(
  () => {
    $('body').addClass('sidebar-mini skin-home fixed');
    $('body').tooltip({ selector: '.js-tooltip' });
  }
);
