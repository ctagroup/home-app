import { escapeString } from '/imports/api/utils';

const BASE_URL = 'https://geocode.xyz/';

function getCurrentLocation() {
    const location = Geolocation.currentLocation();

    if (location !== null && location.coords) {
        return location.coords.latitude + ',' + location.coords.longitude;
    }

    return '';
}

function getAddressAndZipFromLatLong(latLng) {
    const url = createURL(latLng);
    const response = this.doGet(url);

    if (response.error) {
        throw new Meteor.Error(escapeString(response.error.description));
    } 
	
    return [{
        stnumber: response.stnumber ? escapeString(response.stnumber) : '',
        staddress: response.staddress ? escapeString(response.staddress) : '',
        city: response.city ? escapeString(response.city) : '',
        state: response.state ? escapeString(response.state) : '',
        country: response.country ? escapeString(response.country) : ''
    }, {
        zip: response.postal ? escapeString(response.postal) : ''
    }];
}

function getLatLongAndZipFromAddress(address) {
    const url = createURL(address + ",USA");
    const response = this.doGet(url);

    if (!response.error) {
        return [{
            lat: response.latt ? escapeString(response.latt) : '',
            long: response.longt ? escapeString(response.longt) : ''
        }, {
            zip: response.postal ? escapeString(response.postal) : ''
        }];
    }
}

function createURL(location) {
    return `${BASE_URL}?locate=${encodeURIComponent(location)}&json=1`;
}