import Projects from '/imports/api/projects/projects';
import './housingUnitForm.html';


Template.housingUnitForm.helpers(
  {
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
    isActiveYes() {
      return this.inactive ? '' : 'checked';
    },
    isActiveNo() {
      return this.inactive ? 'checked' : '';
    },
    isFamilyUnitYes() {
      return this.familyUnit ? 'checked' : '';
    },
    isFamilyUnitNo() {
      return this.familyUnit ? '' : 'checked';
    },
    isInServiceYes() {
      return this.inService ? 'checked' : '';
    },
    isInServiceNo() {
      return this.inService ? '' : 'checked';
    },
    isVacantYes() {
      return this.vacant ? 'checked' : '';
    },
    isVacantNo() {
      return this.vacant ? '' : 'checked';
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
