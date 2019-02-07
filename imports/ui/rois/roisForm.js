import '/imports/ui/clients/signaturePad';
import './roisForm.html';


Template.roisForm.helpers({
  fieldError(fieldId) {
    return this.errors[fieldId];
  },
  fieldErrors() {
    const keys = Object.keys(this.errors || {});
    return keys.map(key => `${key}: ${this.errors[key].join(', ')}`);
  },
});

Template.roisForm.onRendered(() => {
  $('.js-datepicker').datetimepicker({
    format: 'MM-DD-YYYY',
  });
});
