// TODO: Error handling

import { logger } from '/imports/utils/logger';
import { escapeString } from '/imports/api/utils';

const BASE_URL = 'https://geocode.xyz/';
const LOCATION_ERROR = 'Unable to get location, please enter address manually';

function makeGeocodeAPICall(location) {
  // TODO: When a lat/long is passed in this returns 1 main address if found but can also return
  // multiple "alt" addresses, user should confirm which one because the main address
  // isn't always the correct one
  const url = `${BASE_URL}?locate=${encodeURIComponent(location)}&json=1`;
  const promise = new Promise((resolve, reject) => {
    Meteor.call('surveys.getGeocodedLocation', url, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });

  promise.then(res => {
    return res;
  }).catch(err => {
    return err;
  });
}

export function getAddressFromLatLong(latLng) {
  let address = '';
  const latLngStr = latLng.join(',');
  const response = makeGeocodeAPICall(latLngStr);
  
    if (response.error) {
      logger.error(escapeString(response.error.description));
    }

    if (response.standard) {
      const stnumber = response.standard.stnumber ? response.standard.stnumber : '';
      const staddress = response.standard.staddress ? response.standard.staddress : '';
      const city = response.standard.city ? response.standard.city : '';
      const state = response.standard.state ? response.standard.state : '';
      const country = response.standard.country ? response.standard.country : '';
      const postal = response.standard.postal ? response.standard.postal : '';

      address = escapeString(`${stnumber} ${staddress} ${city} ${state} ${country} ${postal}`);
    }

    return address;
}

export function getLatLongFromAddressOrDevice(address) {
  let latLng = [];

  if (address !== null) {
    // TODO: Improve this to add USA if not already there, if country isn't specified the result can be incorrect
    const response = makeGeocodeAPICall(address);
    if (!response.error) {
          latLng[0] = response.latt ? escapeString(response.latt) : '';
          latLng[1] = response.longt ? escapeString(response.longt) : '';
        }     
  } else {
    const location = Geolocation.currentLocation();
    if (location !== null && location.coords) {
      latLng[0] = location.coords.latitude;
      latLng[1] = location.coords.longitude;
    }
  }
  return latLng;
}
