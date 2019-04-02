import './react.html';
import { renderRoutes } from './routes.js';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('app'));

  $("#removalReason").select2();

  $('.custom-datepicker, .react-datepicker__input-container input').datetimepicker({
    format: 'MM-DD-YYYY'
  });

  var html = '<div class="form form-inline" style="padding: 10px;"><div><label>Add new tag:</label><div class="form-group" style="min-width: 12em; padding: 0px 0.25em;"><div class="css-10nd86i"><div class="css-vj8t7z"><div class="css-1hwfws3"><div class="css-1492t68">Select tag:</div><div class="css-1g6gooi"><div class="" style="display: inline-block;"><input autocapitalize="none" autocomplete="off" autocorrect="off" id="react-select-4-input" spellcheck="false" tabindex="0" type="text" aria-autocomplete="list" value="" style="box-sizing: content-box; width: 2px; background: 0px center; border: 0px; font-size: inherit; opacity: 1; outline: 0px; padding: 0px; color: inherit;"><div style="position: absolute; top: 0px; left: 0px; visibility: hidden; height: 0px; overflow: scroll; white-space: pre; font-size: 14px; font-family: Raleway, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-weight: 400; font-style: normal; letter-spacing: normal; text-transform: none;"></div></div></div></div><div class="css-1wy0on6"><span class="css-d8oujb"></span><div aria-hidden="true" class="css-1ep9fjw"><svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" class="css-19bqh2r"><path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path></svg></div></div></div></div></div><div class="form-group" style="min-width: 12em; padding: 0px 0.25em;"><div class="css-10nd86i"><div class="css-vj8t7z"><div class="css-1hwfws3"><div class="css-1492t68">Select action:</div><div class="css-1g6gooi"><div class="" style="display: inline-block;"><input autocapitalize="none" autocomplete="off" autocorrect="off" id="react-select-5-input" spellcheck="false" tabindex="0" type="text" aria-autocomplete="list" value="" style="box-sizing: content-box; width: 2px; background: 0px center; border: 0px; font-size: inherit; opacity: 1; outline: 0px; padding: 0px; color: inherit;"><div style="position: absolute; top: 0px; left: 0px; visibility: hidden; height: 0px; overflow: scroll; white-space: pre; font-size: 14px; font-family: Raleway, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-weight: 400; font-style: normal; letter-spacing: normal; text-transform: none;"></div></div></div></div><div class="css-1wy0on6"><span class="css-d8oujb"></span><div aria-hidden="true" class="css-1ep9fjw"><svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" class="css-19bqh2r"><path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path></svg></div></div></div></div></div><div class="form-group" style="min-width: 12em; padding: 0px 0.25em;"><div><div class="react-datepicker-wrapper"><div class="react-datepicker__input-container"><input type="text" placeholder="MM/DD/YYYY" class="form-control" value="04/02/2019"></div></div></div></div><div class="form-group" style="min-width: 12em; padding: 0px 0.25em;"><input type="text" placeholder="note" class="form-control input-sm"></div><a class="btn btn-primary" style="margin: 0px 0.25em;">Create</a><a class="btn btn-default tag_form_cancel" style="margin: 0px 0.25em;">Cancel</a></div></div>';
    $("body").on('click', '.tags_form', function(){
  	$(this).html(html);
  });

  $("body").on('click', '.tag_form_cancel', function(){
  	$('.form.form-inline').html('<a class="tags_form">Add new tag</a>');
  });

});