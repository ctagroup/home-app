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
  }
);
Template.housingUnitForm.onRendered(
  () => {
    Meteor.call('getAllProjects', (err, res) => {
      if (err) {
        logger.log(err);
      } else {
        // Making a dynamic element that will bring in values of Projects.
        let dynamicHtml = "<option value='' disabled>Select a Project</option>";
        for (let i = 0; i < res.projects.projects.length; i++) {
          const el = res.projects.projects[i];
          dynamicHtml += `<option value="${el.projectId}">${el.projectName}</option>`;
        }
        $('.project_id').html(dynamicHtml);
      }
    });
    // If data available, set to that drop-down option.
  }
);
