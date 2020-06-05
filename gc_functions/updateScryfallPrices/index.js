const argv = require('yargs').argv;
const CardInfo = require('./CardInfo');
const saveScryfallBulk = require('./saveScryfallBulk');
const mongoBulkImport = require('./mongoBulkImport');

/**
 * Helper function to filters out cards from the Scryfall bulk that are not part of paper magic
 * Returns an array of Scryfall card IDs
 * @param {Array} data
 */
function filterSource(data) {
    return paperOnly = data.filter(d => d.games.includes('paper'));
}

async function init() {
    const { database } = argv;

    if (!database) throw new Error('Mongo database name is required');

    try {
        console.time('updatePrices');

        await saveScryfallBulk();

        const sourceJSON = require('./bulk_data/scryfall-default-cards.json');
        const sourceCards = filterSource(sourceJSON);

        console.log(`Preparing to fetch prices for ${sourceCards.length} cards`);

        const prices = sourceCards.map(c => new CardInfo(c));
        await mongoBulkImport(prices, database);

        console.timeEnd('updatePrices');
        console.log(`Prices updated for database ${database} on ${new Date().toISOString()}`);
    } catch (err) {
        throw err;
    }
}

init().catch(console.log);