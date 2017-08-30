import './contentLayout.html';
import './appNav';
import './footer';

Template.ContentLayout.onRendered(() => {
  $('body').removeClass();
});
