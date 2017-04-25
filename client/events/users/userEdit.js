/**
 * Created by udit on 08/07/16.
 */
import { logger } from '/imports/utils/logger';

const querystring = require('querystring');

const checkPassword = (pass) => {
  const regExp = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$*])(?=.{8,16})');

  return regExp.test(pass);
};

Template.AdminDashboardusersEdit.onRendered(() => {
  GoogleMaps.load(
    {
      key: HomeConfig.googleMaps.apiKey,
    }
  );

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

Template.AdminDashboardusersEdit.events({
  'click .btn-add-role': (e) => {
    logger.info('adding user');
    $('.home-spinner').removeClass('hide').addClass('show');
    Meteor.call('addUserToRole', $(e.target).attr('user'), $(e.target).attr('role'), () => {
      $('.home-spinner').removeClass('show').addClass('hide');
    });
  },
  'click .btn-remove-role': (e) => {
    logger.info('removing user');
    $('.home-spinner').removeClass('hide').addClass('show');
    Meteor.call('removeUserFromRole', $(e.target).attr('user'), $(e.target).attr('role'), () => {
      $('.home-spinner').removeClass('show').addClass('hide');
    });
  },
  'submit #edit-user': (e, tmpl) => {
    e.preventDefault();
    const firstName = tmpl.find('.fName').value.trim();
    const middleName = tmpl.find('.mName').value.trim();
    const lastName = tmpl.find('.lName').value.trim();

    // const projectGroupId = tmpl.find('.projectGroup').value;
    const roleIds = $(tmpl.find('.role')).val();
    const userProfileId = tmpl.find('.userProfile').value;

    // const projectGroup = projectGroups.findOne({ projectGroupId });
    const profile = userProfiles.findOne({ id: userProfileId });

    const newRoles = hmisRoles.find({ id: { $in: roleIds } }).fetch();

    const localUser = users.findOne({ _id: Router.current().params._id });
    const hmisUser = singleHMISUser.findOne({ _id: localUser.services.HMIS.accountId });
    const oldRoles = hmisUser.roles;

    const userObj = {
      firstName,
      middleName,
      lastName,
      // projectGroup,
      profile,
    };

    Meteor.call('updateHMISUser', Router.current().params._id, userObj, (error, result) => {
      if (error) {
        logger.info(error);
      } else {
        logger.info(result);

        Meteor.call(
          'updateHMISUserRoles',
          Router.current().params._id,
          oldRoles,
          newRoles,
          (error1, result1) => {
            if (error1) {
              logger.info(error1);
            } else {
              logger.info(result1);
              const oldUrl = Router.current().url;
              const qs = querystring.stringify(Router.current().params.query);
              let cleanUrl = oldUrl.replace(qs, '');
              cleanUrl = cleanUrl.replace('?', '');
              Router.go(`${cleanUrl}?updated=1`);
            }
          }
        );
      }
    });
  },
  'submit #save-linked-projects': (e) => {
    e.preventDefault();
    const projectsLinked = $('.projectsLinked').val();

    Meteor.call(
      'updateLinkedProjects',
      Router.current().params._id,
      projectsLinked,
      (error, result) => {
        if (error) {
          logger.info(error);
        } else {
          logger.info(result);
          const oldUrl = Router.current().url;
          const qs = querystring.stringify(Router.current().params.query);
          let cleanUrl = oldUrl.replace(qs, '');
          cleanUrl = cleanUrl.replace('?', '');
          Router.go(`${cleanUrl}?updated=1`);
        }
      }
    );
  },
  'submit #change-password': (e, tmpl) => {
    e.preventDefault();
    const currentPassword = tmpl.find('.current-password').value;
    const newPassword = tmpl.find('.new-password').value;
    const confirmNewPassword = tmpl.find('.confirm-new-password').value;

    if (newPassword !== confirmNewPassword) {
      Bert.alert('Password and Password confirmation must match.', 'danger', 'growl-top-right');
      return;
    }

    if (!checkPassword(newPassword)) {
      Bert.alert('The password must contain 8 to 16 characters long, It must contain at least one lowercase character, one uppercase character, one number, and one of the following special characters !@#$*', 'danger', 'growl-top-right'); // eslint-disable-line

      return;
    }

    Meteor.call('changeHMISPassword', currentPassword,
    newPassword, confirmNewPassword, (err) => {
      if (err) {
        if (err.error === 'ERR_CODE_INVALID_CURRENT_PASSWORD') {
          Bert.alert('The specified current password does not match with the password stored in the database.', 'danger', 'growl-top-right'); // eslint-disable-line
        } else {
          Bert.alert('Error changing password. Please try again.', 'danger', 'growl-top-right');
        }
      } else {
        Bert.alert('Your password was changed.', 'success', 'growl-top-right');
      }
    });
  },
});
