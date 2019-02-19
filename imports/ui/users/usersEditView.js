import { ReactiveVar } from 'meteor/reactive-var';
import './userEditForm';
import './changePasswordForm';
import './usersEditView.html';
import HmisRoles from '/imports/api/users/hmisRoles';

Template.usersEditView.helpers({
  hmisRoles() {
    return HmisRoles.find().fetch();
  },
  projectsLinked() {
    return Template.instance().projectsLinked.get();
  },
  isLogggedInUser() {
    return this.user._id === Meteor.userId();
  },
  getHmisStatusLabel() {
    switch (this.user.HMIS.status) {
      case 'ACTIVE':
        return 'label-success';
      case 'INACTIVE':
        return 'label-danger';
      case 'PENDING':
        return 'label-warning';
      default:
        return '';
    }
  },
  /*
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
  */
});

Template.usersEditView.onCreated(function onCreated() {
  this.projectsLinked = new ReactiveVar();
  Meteor.call('users.projects.all', (err, res) => res && this.projectsLinked.set(res));
});

Template.usersEditView.helpers({});

Template.usersEditView.onRendered(() => {
  const { googleMaps } = Meteor.settings.public;
  if (googleMaps) {
    GoogleMaps.load({ key: googleMaps.apiKey });
  }

  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready('locationHistory', (map) => {
    const poly = new google.maps.Polyline({
      strokeColor: '#428bca',
      strokeOpacity: 1.0,
      strokeWeight: 3,
    });

    poly.setMap(map.instance);

    const bounds = new google.maps.LatLngBounds();

    const userID = Session.get('admin_id');
    const locationHistory = LocationTracker.getLocationHistory(userID);

    for (let i = 0; i < locationHistory.length; i += 1) {
      const path = poly.getPath();

      const latLong = new google.maps.LatLng(
        locationHistory[i].position.lat,
        locationHistory[i].position.long
      );

      // Because path is an MVCArray, we can simply append a new coordinate
      // and it will automatically appear.
      path.push(latLong);

      // Add a new marker at the new plotted point on the polyline.
      /* eslint-disable */
      const marker = new google.maps.Marker({
        position: latLong,
        title: locationHistory.timestamp,
        map: map.instance,
      });
      /* eslint-enable */

      bounds.extend(latLong);
    }

    map.instance.fitBounds(bounds);       // auto-zoom
    map.instance.panToBounds(bounds);     // auto-center
  });

  $('.projectsLinked').select2({
    placeholder: 'Choose Projects',
    allowClear: true,
    theme: 'classic',
  });
});

Template.usersEditView.events({

});
