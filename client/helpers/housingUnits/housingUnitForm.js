/**
 * Created by Mj on 24-Aug-16.
 */
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
      return projects.find({}).fetch();
    },
    isProjectSelected(projectId) {
      const data = Router.current().data();
      return projectId === data.projectId ? 'selected' : '';
    },
  }
);
