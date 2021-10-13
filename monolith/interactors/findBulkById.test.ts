import { MongoMemoryServer } from 'mongodb-memory-server';
import getDatabaseConnection from '../database';
import bulkCard from '../fixtures/fixtures';
import findBulkById from './findBulkById';

const SCRYFALL_BULK = 'scryfall_bulk_cards';

let mongoServer;
let db;

// Set up the mongo memory instance
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    db = await getDatabaseConnection(uri);

    // Create fake bulk collection
    const bulkCollection = await db.createCollection(SCRYFALL_BULK);

    // Insert one bulk card, mimic the database seed script by overwriting `_id` with `card.id`
    await bulkCollection.insert({ _id: bulkCard.id, ...bulkCard });
});

afterAll(async () => {
    await mongoServer.stop();
});

test('Grabs the correct card by id', async () => {
    const card = await findBulkById('f3d62dbd-63db-4ac9-950f-9852627f23f2');
    expect(card.id).toBe('f3d62dbd-63db-4ac9-950f-9852627f23f2');
    expect(card.name).toBe('Time Spiral');
});
