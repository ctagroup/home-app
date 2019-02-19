function registerDeleteOption() {
  $('#aoptions').on(
    'click', 'a.optionremove', () => {
      const rowId = $(this).attr('id');
      const i = rowId.split('.');
      const i1 = i[1];
      $(`#${i1}`).remove();
    }
  );
}

export function setFields(status) {
  $('#isCopy').attr('disabled', status);
  $('#allowSkip').attr('disabled', status);
  $('#q_copy').attr('disabled', status);
  $('#q_category').attr('disabled', status);
  $('#q_name').attr('disabled', status);
  $('#q_type').attr('disabled', status);
  $('#q_audience').attr('disabled', status);
  $('#question').summernote(status ? 'disable' : 'enable');
  $('#hud').attr('disabled', status);
  $('#q_dataType').attr('disabled', status);
  if ((
        document.getElementById('q_dataType').value === 'Multiple Select'
      ) ||
      (
        document.getElementById('q_dataType').value === 'Single Select'
      )) {
    $('#aoptions :input').attr('disabled', status);
    if (status === false) {
      $('.optionadd').unbind('click', false);
      $('.optionremove').unbind('click', false);
    } else {
      $('.optionadd').bind('click', false);
      $('.optionremove').bind('click', false);
    }
  }
}

export function populateOptions(question) {
  let $optionsTag;
  for (let i = 0; i < question.options.length; i += 1) {
    if (question.options[i].description != null) {
      $optionsTag = `<tr  id='${i}' class='questionRow'><td>
        <input type='text' id='${i}.value' class='value' value='${question.options[i].value}'/>
        </td>`;
      $optionsTag += `<td>
        <input type="text" id="${i}.description" class="description"
        value="${question.options[i].description}">
      </td>`;
      $optionsTag += `<td><a id='delete.${i}' class='btn btn-primary optionremove'>
        <span class='fa fa-remove'></span></a></td></tr>`;
      $('#aoptions').append($optionsTag);
      registerDeleteOption();
    }
  }
}

export function resetQuestionModal() {
  $('#newQuestionModal input[type=text]').val('');
  $('#newQuestionModal #q_dataType').val('Textbox(String)').change();
  $('#newQuestionModal #q_type').val('hud').change();
  $('#newQuestionModal #q_audience').val('everyone').change();
  $('#newQuestionModal input[type=checkbox]').attr('checked', false);
  $('#newQuestionModal input[type=checkbox]').prop('checked', false);
  $('.isCopySet').hide();
  $('#isUpdate').val('0');
  $('#questionID').val('');
  $('#question').summernote('code', '');
}
