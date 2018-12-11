import { escapeString } from '/imports/api/utils';

const BASE_URL = 'https://geocode.xyz/';

function getCurrentLocation() {
    const location = Geolocation.currentLocation();
    let latLng = '';

    if (location !== null && location.coords) {
        latLng = location.coords.latitude + ',' + location.coords.longitude;
    }

    return latLng;
}

function getAddressAndZipFromLatLong(latLng) {
	const url = `${BASE_URL}/?locate=${latLng}&geoit=json`;
    const response = this.doGet(url);
	
	if (!response.error) {
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
    
    throw new Meteor.Error(escapeString(response.error.description));
}

function getLatLongAndZipFromAddress(address) {
    
    const encodedAddress = encodeURIComponent(address + ",USA");
    const url = `${BASE_URL}/?locate=${encodedAddress}&json=1`;
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