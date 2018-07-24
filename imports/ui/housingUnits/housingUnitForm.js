import Projects from '/imports/api/projects/projects';
import './housingUnitForm.html';


Template.housingUnitForm.helpers(
  {
    getBedsCurrent() {
      // Set all radio boxes here.
      if (Template.currentData().inactive) {
        $('input[name="inactive"][value="true"]').prop('checked', true);
      }
      if (!Template.currentData().familyUnit) {
        $('input[name="family_unit"][value="false"]').prop('checked', true);
      }
      if (!Template.currentData().inService) {
        $('input[name="in_service"][value="false"]').prop('checked', true);
      }
      if (!Template.currentData().vacant) {
        $('input[name="vacant"][value="false"]').prop('checked', true);
      }
      return Template.currentData().bedsCurrent;
    },
    getProjects() {
      return Projects.find().fetch().sort((a, b) => {
        if (a.projectName === b.projectName) {
          return (a.schema || '').localeCompare(b.schema);
        }
        return (a.projectName || '').localeCompare(b.projectName);
      });
    },
    isProjectSelected(projectId) {
      const data = Router.current().data();
      return projectId === data.housingUnit.projectId ? 'selected' : '';
    },
  }
);

Template.housingUnitForm.onRendered(() => {
  $('.project_id').select2({
    placeholder: 'Select a project',
    allowClear: true,
    theme: 'classic',
  });
});
