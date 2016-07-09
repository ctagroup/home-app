/**
 * Created by udit on 08/07/16.
 */

Template.AdminDashboardusersEdit.helpers(
  {
    locationHistoryMapOptions() {
      // Make sure the maps API has loaded
      if (GoogleMaps.loaded()) {
        // Map initialization options
        return {
          center: new google.maps.LatLng(0, -180),
          zoom: 8
        };
      }
    },
  }
);
