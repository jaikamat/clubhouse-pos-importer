import { MongoMemoryServer } from 'mongodb-memory-server';
import Connection from '../database';
import bulkCard from '../fixtures/fixtures';
import ScryfallCardModel from '../models/ScryfallCardModel';
import addCardToInventory from './addCardToInventory';
import getCardsWithInfo from './getCardsWithInfo';

let mongoServer;

// Set up the mongo memory instance
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await Connection.open(uri);

    // Insert one bulk card
    await ScryfallCardModel.collection.insertOne(bulkCard);

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

test('Fetching the bulk card without matching "in stock"', async () => {
    // Remove the cards from inventory
    await addCardToInventory({
        quantity: -4,
        finishCondition: 'FOIL_NM',
        id: bulkCard.id,
        name: bulkCard.name,
        set_name: bulkCard.set_name,
        set: bulkCard.set,
        location: 'ch1',
    });

    const foundDoc = await getCardsWithInfo('Time Spiral', false, 'ch1');

    expect(foundDoc.length).toBe(1);

    expect(foundDoc[0].name).toMatchInlineSnapshot(`"Time Spiral"`);
    expect(foundDoc[0].id).toMatchInlineSnapshot(
        `"f3d62dbd-63db-4ac9-950f-9852627f23f2"`
    );
    expect(foundDoc[0].qoh).toMatchInlineSnapshot(`
        Object {
          "FOIL_NM": 0,
        }
    `);
});

// TODO: do a test with `matchInStock` boolean
