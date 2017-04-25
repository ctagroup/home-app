/**
 * Created by udit on 03/08/16.
 */
import { logger } from '/imports/utils/logger';

Template.responseForm.onRendered(
  () => {
    $('.js-datepicker').datetimepicker({
      format: 'MM-DD-YYYY',
    });
    $('.js-summernote').summernote({
      minHeight: 100,
      fontNames: HomeConfig.fontFamilies,
    });
  }
);

Template.responseForm.events(
  {
    'click .optionadd': (evt) => {
      const questionID = evt.currentTarget.id;
      let optionLength = $(`#aoptions${questionID}`).children().length;
      let optionsTag;
      optionLength += 1;
      const deleteID = `${questionID}${optionLength}`;
      optionsTag = `<tr  id='${deleteID}' class='questionRow'>`;

      optionsTag += `<td>
        <input type="text" id="${optionLength}.description" class="description" />
      </td>`;

      optionsTag += `<td><a id='delete.${deleteID}' class='btn btn-primary optionremove' >
        <span class='fa fa-remove'></span></a></td></tr>`;
      $(`#aoptions${evt.currentTarget.id}`).append(optionsTag);
      $(`#aoptions${evt.currentTarget.id}`).on(
        'click', 'a.optionremove', function remove() {
          const rowId = $(this).attr('id');
          const i = rowId.split('.');
          const i1 = `${i[1]}`;
          $(`#${i1}`).remove();
        }
      );
    },
    'change .hideWhenSkipped': (evt) => {
      const toggleSkip = $(`#${evt.target.id}`).is(':checked');
      if (toggleSkip) {
        $(`.${evt.target.id}`).hide();
      } else {
        $(`.${evt.target.id}`).show();
      }
    },
    'change .singleSelect': (evt, tmpl) => {
      const element = tmpl.find('.singleSelect:checked');
      const optionValue = $(element).val();

      if (optionValue.toLowerCase() === 'others' || optionValue.toLowerCase() === 'other') {
        $('.othersSpecify_single').removeClass('hide');
      } else {
        $('.othersSpecify_single').addClass('hide');
      }
    },
    'change .multipleSelect': (evt, tmpl) => {
      const element = tmpl.findAll('.multipleSelect:checkbox:checked');

      let showflag = false;

      for (let i = 0; i < element.length; i += 1) {
        if ($(element[i]).val().toLowerCase() === 'others'
            || $(element[i]).val().toLowerCase() === 'other') {
          showflag = true;
          break;
        }
      }

      if (showflag) {
        $('.othersSpecify_multiple').removeClass('hide');
      } else {
        $('.othersSpecify_multiple').addClass('hide');
      }
    },
    'change .js-photo-input': (event) => {
      const file = document.querySelector('.js-photo-input').files[0];
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        $(event.currentTarget).closest('.quesList').find('.survey-single-photo-img')
          .attr('src', reader.result);
        $(event.currentTarget).closest('.quesList').find('.survey-single-photo-value')
          .val(reader.result);
      }, false);

      if (file) {
        reader.readAsDataURL(file);
      }
    },
    'click .js-take-photo': (event) => {
      event.preventDefault();
      logger.log('clicked picture button');
      MeteorCamera.getPicture({}, (error, data) => {
        if (error) {
          logger.log(error);
        } else {
          $(event.currentTarget).closest('.quesList').find('.survey-single-photo-img')
            .attr('src', data);
          $(event.currentTarget).closest('.quesList').find('.survey-single-photo-value')
            .val(data);
          $(event.currentTarget).closest('.quesList').find('.js-remove-photo')
            .removeClass('hide');
        }
      });
    },
    'click .js-remove-photo': (event) => {
      event.preventDefault();
      logger.log('clicked remove picture button');
      $(event.currentTarget).closest('.quesList').find('.survey-single-photo-img')
        .attr('src', '');
      $(event.currentTarget).closest('.quesList').find('.survey-single-photo-value')
        .val('');
      $(event.currentTarget).closest('.quesList').find('.js-remove-photo')
        .addClass('hide');
    },
  }
);
