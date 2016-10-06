/**
 * Created by udit on 05/10/16.
 */

Template.projectSetup.helpers(
  {
    getProjects() {
      return projects.find({}).fetch();
    },
  }
);
