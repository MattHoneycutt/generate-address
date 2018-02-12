const rp = require('request-promise-native');
const cheerio = require('cheerio');

const googleApiKey = '--YOUR KEY HERE--';

class AddressCreator {

    static getRandomAddress() {
        
        const requestOptions = {
            uri: 'https://fakena.me/random-real-address/',
            transform: html => cheerio.load(html)
        }

        let address;

        return rp(requestOptions).then($ => {
            const rawAddress = $('strong').html();

            const regex = /(\d+ [\w ]+)\<br\>([\w ]+), ([A-Za-z]{2}) (\d{5}-\d{4})/g;

            const match = regex.exec(rawAddress);

            if (match === null || match.length !== 5) {
                console.error('Unable to parse the result!');
                return;
            }
            
            address = {
                street: match[1],
                city: match[2],
                state: match[3],
                zip: match[4]
            };

            return rp(`https://maps.googleapis.com/maps/api/geocode/json?address=${rawAddress.replace('<br>', ' ')}&key=${googleApiKey}`);
        }).then(body => {
            const response = JSON.parse(body);

            address.latitude = response.results[0].geometry.location.lat;
            address.longitude = response.results[0].geometry.location.lng;

            return address;
        });
    }
}

module.exports = AddressCreator;