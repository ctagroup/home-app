/**
 * Created by udit on 01/08/16.
 */

Template.clientForm.events(
  {
    'change #js-photo-input': () => {
      const file = document.querySelector('#js-photo-input').files[0];
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        $('#client-photo-img').attr('src', reader.result);
        $('#client-photo-value').val(reader.result);
      }, false);

      if (file) {
        reader.readAsDataURL(file);
      }
    },
    'click #js-take-photo': (event) => {
      event.preventDefault();
      logger.log('clicked picture button');
      MeteorCamera.getPicture({}, (error, data) => {
        if (error) {
          logger.log(error);
        } else {
          $('#client-photo-img').attr('src', data);
          $('#client-photo-value').val(data);
          $('#js-remove-photo').removeClass('hide');
        }
      });
    },
    'click #js-remove-photo': (event) => {
      event.preventDefault();
      logger.log('clicked remove picture button');
      $('#client-photo-img').attr('src', '');
      $('#client-photo-value').val('');
      $('#js-remove-photo').addClass('hide');
    },
  }
);
