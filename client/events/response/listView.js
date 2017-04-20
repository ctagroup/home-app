/**
 * Created by Mj on 11/3/2016.
 */
Template.responsesListView.events(
  {
    'click .UploadResponses': (evt/* , tmpl*/) => {
      evt.preventDefault();
      const responseId = $(evt.currentTarget).attr('id');
      const parent = $(`#${responseId}`).parent();
      const originalHtml = parent.html();
      parent.html('<i class="fa fa-spinner fa-pulse"></i>');

      Meteor.call('uploadResponse', responseId, (err) => {
        if (err) {
          parent.html(originalHtml);
          Bert.alert(err.reason || err.error, 'danger', 'growl-top-right');
        } else {
          Bert.alert('Response uploaded', 'success', 'growl-top-right');
          const htmlOk = '<span class="text-success">' +
                  '<i class="fa fa-check"></i> ' +
                  'Submitted' +
                  '</span>' +
                  '<br>' +
                  `<a id="${responseId}" href="#" class="btn UploadResponses">` +
                  '(Re-Upload to HMIS)</a>';
          // change button to completed.
          parent.html(htmlOk);
        }
      });
    },
  }
);
