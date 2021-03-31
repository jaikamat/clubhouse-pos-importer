const { ExpectationFailed } = require('http-errors');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
// TODO: We currently require in the built code. We should be requiring the TS file,
// but this will require some finagling with tooling configs
const {
    default: getCardsWithInfo,
} = require('../built/interactors/getCardsWithInfo');
const {
    default: addCardToInventory,
} = require('../built/interactors/addCardToInventory');
const bulkCard = require('../fixtures/fixtures');

let mongoServer;
let client;
const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const PROD_DB = 'clubhouse_collection_production';
const SCRYFALL_BULK = 'scryfall_bulk_cards';

// Set up the mongo memory instance
beforeEach(async () => {
    mongoServer = new MongoMemoryServer();
    // Interactors use this to establish a connection
    process.env.MONGO_URI = await mongoServer.getUri();

    // Establish our own connection outside of interactors to inspect db
    client = await new MongoClient.connect(process.env.MONGO_URI, mongoOptions);

    // Create fake bulk collection
    const bulkCollection = await client
        .db(PROD_DB)
        .createCollection(SCRYFALL_BULK);

    // Insert one bulk card
    await bulkCollection.insert(bulkCard);

    // Add some cards to store inventory collection
    await addCardToInventory({
        quantity: 4,
        finishCondition: 'FOIL_NM',
        id: bulkCard.id,
        name: bulkCard.name,
        set_name: bulkCard.set_name,
        set: bulkCard.set,
        location: 'ch1',
    });
});

afterEach(async () => {
    await mongoServer.stop();
});

test('Fetching the bulk card to ensure it persisted', async () => {
    const foundDoc = await getCardsWithInfo('Time Spiral', true, 'ch1');

    expect(foundDoc.length).toBe(1);

    expect(foundDoc[0].name).toMatchInlineSnapshot(`"Time Spiral"`);
    expect(foundDoc[0].id).toMatchInlineSnapshot(
        `"f3d62dbd-63db-4ac9-950f-9852627f23f2"`
    );
    expect(foundDoc[0].qoh).toMatchInlineSnapshot(`
        Object {
          "FOIL_NM": 4,
        }
    `);
});
