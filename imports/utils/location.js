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

  return new Promise((resolve, reject) => {
    Meteor.call('surveys.getGeocodedLocation', url, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

export function getAddressFromLatLong(latLng) {
  const latLngStr = latLng.join(',');
  let address = '';
  makeGeocodeAPICall(latLngStr)
    .then(result => {
      if (result.error) {
        logger.error(escapeString(response.error.description));
      }

      if (result.standard) {
        const stnumber = result.standard.stnumber || '';
        const staddress = result.standard.staddress || '';
        const city = result.standard.city || '';
        const state = result.standard.state || '';
        const country = result.standard.country || '';
        const postal = result.standard.postal || '';

        address = escapeString(`${stnumber} ${staddress} ${city} ${state} ${country} ${postal}`);
      }

      return address;
    })
    .catch(error => {
      return address;
    });
}

export function getLatLongFromAddressOrDevice(address) {
  const latLng = [];

  if (address !== undefined) {
    // TODO: Improve this to add USA if not already there, if country isn't specified the
    // result can be incorrect
    makeGeocodeAPICall(address)
      .then(result => {
        if (!result.error) {
          latLng[0] = result.latt ? escapeString(result.latt) : '';
          latLng[1] = result.longt ? escapeString(result.longt) : '';
        }
        return latLng;
      })
      .catch(error => {
        return latLng;
      });
  } else {
    const location = Geolocation.currentLocation();
    if (location !== null && location.coords) {
      latLng[0] = location.coords.latitude;
      latLng[1] = location.coords.longitude;
    }
  }
  return latLng;
}
