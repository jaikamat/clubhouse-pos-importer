const { MongoMemoryServer } = require('mongodb-memory-server');
// TODO: We currently require in the built code. We should be requiring the TS file,
// but this will require some finagling with tooling configs
const {
    default: getCardsWithInfo,
} = require('../built/interactors/getCardsWithInfo');
const {
    default: addCardToInventory,
} = require('../built/interactors/addCardToInventory');
const getDatabaseConnection = require('../built/database').default;
const bulkCard = require('../fixtures/fixtures');

const SCRYFALL_BULK = 'scryfall_bulk_cards';

let mongoServer;
let db;

// Set up the mongo memory instance
beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const uri = await mongoServer.getUri();
    db = await getDatabaseConnection(uri);

    // Create fake bulk collection
    const bulkCollection = await db.createCollection(SCRYFALL_BULK);

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
