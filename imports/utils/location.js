import { logger } from '/imports/utils/logger';
import { escapeString } from '/imports/api/utils';

const BASE_URL = 'https://geocode.xyz/';
const LOCATION_ERROR = 'Unable to get location, please enter address manually';

export function getAddressFromLatLong(latLng) {
    const latLngStr = latLng.join(',');
    const response = makeGeocodeAPICall(latLngStr);

    if (response.error) {
        logger.error(escapeString(response.error.description));
        throw new Meteor.Error(LOCATION_ERROR);
    }

    let stnumber = response.stnumber ? response.stnumber : '',
        staddress = response.staddress ? response.staddress : '',
        city = response.city ? response.city : '',
        state = response.state ? response.state : '',
        country = response.country ? response.country : '',
        postal = response.postal ? response.postal : ''; 

    return escapeString(`${stnumber} ${staddress} ${city} ${state} ${country} ${postal}`);
}

export function getLatLongFromAdressOrDevice(address) {
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
        } else {
            throw new Meteor.error(LOCATION_ERROR);
        }
    }

    return latLng;
}

function makeGeocodeAPICall(location) {
    // TODO: When a lat/long is passed in this returns 1 main address if found but can also return
    // multiple "alt" addresses, user should confirm which one because the main address isn't always the correct one
    const url = `${BASE_URL}?locate=${encodeURIComponent(location)}&json=1`;
    return this.doGet(url);
}