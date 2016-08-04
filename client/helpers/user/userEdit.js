Template.AdminDashboardusersEdit.helpers(
  {
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
