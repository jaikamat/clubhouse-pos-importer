import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Connection from '../database';
import bulkCard from '../fixtures/fixtures';
import ScryfallCard from '../models/ScryfallCardModel';
import findBulkById from './findBulkById';

let mongoServer;
let db;

// Set up the mongo memory instance
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await Connection.open(uri);
    db = mongoose.connection.db;

    // Create a new bulk card, the db seed script overwrites `_id` with scryfall's `id`
    const BulkCard = new ScryfallCard({ _id: bulkCard.id, ...bulkCard });
    await BulkCard.save();
});

afterAll(async () => {
    await mongoServer.stop();
});

test('Grabs the correct card by id', async () => {
    const card = await findBulkById('f3d62dbd-63db-4ac9-950f-9852627f23f2');
    expect(card.id).toBe('f3d62dbd-63db-4ac9-950f-9852627f23f2');
    expect(card.name).toBe('Time Spiral');
});
