Template.AdminDashboardusersEdit.helpers(
  {
    getHMISStatusLabel(status) {
      let cssclass = '';
      switch (status) {
        case 'ACTIVE':
          cssclass = 'label-success';
          break;
        case 'INACTIVE':
          cssclass = 'label-danger';
          break;
        case 'PENDING':
          cssclass = 'label-warning';
          break;
        default:
          cssclass = '';
      }
      return cssclass;
    },
    debugAPIMode() {
      return (Router.current().params.query && Router.current().params.query.debugHMIS);
    },
    printHMISData() {
      const user = users.findOne({ _id: Router.current().params._id });
      return JSON.stringify(user.services.HMIS, null, '\t');
    },
    showUpdatedMessage() {
      if (Router.current().params.query && Router.current().params.query.updated) {
        return '<div class="alert alert-success admin-alert">' +
          'User information is saved successfully.' +
        '</div>';
      }
      return '';
    },
    getOtherRoles(userId) {
      return HomeHelpers.getOtherRoles(userId);
    },
    getUserRoles(userId) {
      return HomeHelpers.getUserRoles(userId);
    },
    getProjects() {
      return projects.find({}).fetch();
    },
    isProjectSelected(projectId) {
      const data = Router.current().data();
      if (data.projectsLinked && data.projectsLinked.length > 0) {
        return data.projectsLinked.indexOf(projectId) > -1 ? 'selected' : '';
      }

      return '';
    },
    getProjectName(projectId) {
      const project = projects.findOne({ _id: projectId });
      let projectName = projectId;
      if (project) {
        projectName = project.projectName;
      }
      return projectName;
    },
    locationHistoryMapOptions() {
      // Make sure the maps API has loaded
      if (GoogleMaps.loaded()) {
        let center = new google.maps.LatLng(0, -180);

        const userID = Session.get('admin_id');

        if (userID) {
          const lastPosition = LocationTracker.getLastPosition(userID);
          center = new google.maps.LatLng(lastPosition.lat, lastPosition.long);
        }

        // Map initialization options
        return {
          center,
          zoom: 5,
        };
      }

      return {};
    },
    isLoggedUser() {
      return Meteor.user()._id === Router.current().params._id;
    },
  }
);
