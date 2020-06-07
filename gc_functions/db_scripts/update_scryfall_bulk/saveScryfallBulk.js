const fs = require('fs');
const path = require('path');
const axios = require('axios');

/**
 * Retrieves and saves a Scryfall bulk file
 * @param {String} bulkType - the type of bulk JSON used in Scryfall
 */
async function saveScryfallBulk(bulkType) {
    try {
        const bulkUri = 'https://api.scryfall.com/bulk-data';

        const { data } = await axios.get(bulkUri);
        const defaultCardsUri = data.data.find(d => d.type === bulkType).download_uri;

        const myPath = path.resolve(__dirname, 'bulk_data', `bulk_${bulkType}.json`);
        const writer = fs.createWriteStream(myPath);

        console.log('Fetching Scryfall bulk...');

        const response = await axios({
            url: defaultCardsUri,
            method: 'GET',
            responseType: 'stream'
        })

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                console.log('Scryfall bulk downloaded and written');
                resolve();
            });

            writer.on('error', reject);
        })
    } catch (err) {
        throw err;
    }
}

module.exports = saveScryfallBulk;