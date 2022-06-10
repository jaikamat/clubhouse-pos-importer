import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Connection from '../database';
import bulkCard from '../fixtures/fixtures';
import addCardToInventory from './addCardToInventory';
import getCardsWithInfo from './getCardsWithInfo';

const SCRYFALL_BULK = 'scryfall_bulk_cards';

let mongoServer;
let db;

// Set up the mongo memory instance
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await Connection.open(uri);
    db = mongoose.connection.db;

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

afterAll(async () => {
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
