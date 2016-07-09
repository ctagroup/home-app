/**
 * Created by udit on 08/07/16.
 */

Template.AdminDashboardusersEdit.onRendered(() => {
  GoogleMaps.load(
    {
      key: 'AIzaSyBgtp3THzh_A0FTVsEEsbUUqEgm-9b3Dos',
    }
  );

  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready('locationHistory', function(map) {
    // Add a marker to the map once it's ready
    var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance
    });
  });
});
