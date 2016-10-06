/**
 * Created by udit on 05/10/16.
 */

Template.housingUnitForm.onRendered(() => {
  $('.project_id').select2({
    placeholder: 'Select a project',
    allowClear: true,
    theme: 'classic',
  });
});
