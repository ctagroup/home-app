import './react.html';
import { renderRoutes } from './routes.js';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import HomeConfig from '/imports/config/homeConfig';

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('app'));

  $('body').on('click', '.js-open-referral-status-modal', function (event) {
    $('#referral-status-step').val($(event.currentTarget).data('step'));
    $('#referralStatusUpdateCommentsModal').modal(
      {
        keyboard: false,
        backdrop: false,
      }
    );
  });

  $('body').on('click', '.js-close-referral-status-modal', function () {
    $('#referralStatusComments').summernote('code', '');
    $('#referral-status-step').val('');
    $('#referralStatusUpdateCommentsModal').modal('hide');
  });

  $('.custom-js-summernote').summernote({
    minHeight: 100,
    fontNames: HomeConfig.fontFamilies,
  });
});
