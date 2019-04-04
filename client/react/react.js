import './react.html';
import { renderRoutes } from './routes.js';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import HomeConfig from '/imports/config/homeConfig';
import Alert from '/imports/ui/alert';

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('app'));

  $("#removalReason").select2();

  $('.custom-datepicker, .react-datepicker__input-container input').datetimepicker({
    format: 'MM-DD-YYYY'
  });

  $("body").on('click', '.tag_form_cancel', function(){
  	$('.form.form-inline').html('<a class="tags_form">Add new tag</a>');
  });

  $('body').on('click', '.js-open-referral-status-modal', function(event){
  	$('#referral-status-step').val($(event.currentTarget).data('step'));
      $('#referralStatusUpdateCommentsModal').modal(
      {
        keyboard: false,
        backdrop: false,
      }
    );
  });

  $('body').on('click', '.js-close-referral-status-modal', function(event){
  	$('#referralStatusComments').summernote('code', '');
    $('#referral-status-step').val('');
    $('#referralStatusUpdateCommentsModal').modal('hide');
  });

  $('.custom-js-summernote').summernote({
    minHeight: 100,
    fontNames: HomeConfig.fontFamilies,
  });

  $('body').on('change', '#removalReason', function(event){
  	if($(this).val() == 'housed_by_cars_(include_agency/program)'){
	    $('#removalRemarks').parent('.form-group').show();
	  }else{
	  	$('#removalRemarks').parent('.form-group').hide();
	  }
  });

});