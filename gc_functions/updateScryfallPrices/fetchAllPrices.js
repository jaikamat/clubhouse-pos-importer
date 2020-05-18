const Bottleneck = require('bottleneck');
const retrievePrice = require('./retrievePrice');

/**
 * Throttles and fetches prices from a list of Scryfall card objects
 * @param {Array} data - The Scryfall Bulk Data
 */
module.exports = async function fetchAllPrices(data) {
    const limiter = new Bottleneck({ maxConcurrent: 1, minTime: 125 }); // 8 requests per second

    // Assign a callback to the 'failed' job event; called every time a job fails
    limiter.on('failed', async (err, jobInfo) => {
        const { id } = jobInfo.options;
        console.log(`Job ${id} failed: ${err}`);

        if (jobInfo.retryCount < 2) { // Retry twice
            console.log(`Retrying job ${id} in 25ms`);
            return 25;
        }
    })

    // Subscribe to the 'retry' event to log
    limiter.on('retry', (err, jobInfo) => console.log(`Now retrying ${jobInfo.options.id}`));

    // Wrap the callback using the limiter to throttle
    const throttledRetrievePrice = limiter.wrap(retrievePrice);

    // Create the list of Promises
    const allRequestPromises = data.map(id => throttledRetrievePrice(id));

    return await Promise.all(allRequestPromises);
}