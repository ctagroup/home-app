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
  }
);
