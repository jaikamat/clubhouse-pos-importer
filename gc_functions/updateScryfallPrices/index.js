const argv = require('yargs').argv;
const sourceJSON = require('../../clubhouse_data/scryfall-default-cards.json');
const fetchAllPrices = require('./fetchAllPrices');
const mongoBulkImport = require('./mongoBulkImport');

/**
 * Helper function to filters out cards from the Scryfall bulk that are not part of paper magic
 * Returns an array of Scryfall card IDs
 * @param {Array} data
 */
function filterSource(data) {
    const paperOnly = data.filter(d => d.games.includes('paper'));
    return paperOnly.map(c => c.id);
}

async function init() {
    const { database } = argv;

    if (!database) throw new Error('Mongo database name is required');

    try {
        console.time('updatePrices');

        const cardIds = filterSource(sourceJSON);

        console.log(`Preparing to fetch prices for ${cardIds.length} cards`);

        const prices = await fetchAllPrices(cardIds);

        // If some requests fail, their array values will be null and will block the mongo import - remove them
        const filteredResults = prices.filter(d => d !== null);

        await mongoBulkImport(filteredResults, database);

        console.timeEnd('updatePrices');
        console.log(`Prices updated for database ${database} on ${new Date().toISOString()}`);
    } catch (err) {
        throw err;
    }
}

init().catch(console.log);