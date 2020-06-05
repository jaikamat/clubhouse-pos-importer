const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports = async function saveScryfallBulk() {
    const bulkUri = 'https://api.scryfall.com/bulk-data';

    const { data } = await axios.get(bulkUri);
    const defaultCardsUri = data.data.find(d => d.type === 'default_cards').download_uri;

    const myPath = path.resolve(__dirname, 'bulk_data', 'scryfall-default-cards.json');
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
}