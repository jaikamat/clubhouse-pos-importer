import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { Collection } from '../common/types';
import Connection from '../database';
import bulkCard from '../fixtures/fixtures';
import ScryfallCardModel from '../models/ScryfallCardModel';
import getReceivingById from './getReceivingById';

let mongoServer;

// Set up the mongo memory instance
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await Connection.open(uri);

    // Insert one bulk card
    await ScryfallCardModel.collection.insertOne(bulkCard);

    // Insert user
    // TODO: Replace with mongoose schema queries
    const db = await mongoose.connection.db;
    await db.collection(Collection.users).insertOne({
        username: 'Jane Doe',
        password: 'password',
        locations: ['ch1'],
        lightspeedEmployeeNumber: 17,
    });

    // Create receiving entity
    await db.collection(Collection.receivedCards).insertOne({
        _id: new mongoose.Types.ObjectId('receiving-id'),
        created_at: 'date',
        employee_number: 17,
        received_card_list: [{ id: bulkCard.id }],
        created_by: new mongoose.Types.ObjectId('user-id-3456'),
        customer_contact: null,
        customer_name: 'Jane Doe',
    });
});

afterAll(async () => {
    await mongoServer.stop();
});

test('Fetch the receiving entity to ensure it persisted', async () => {
    const foundDoc: any = await getReceivingById('receiving-id', 'ch1');

    expect(foundDoc.customer_name).toBe('Jane Doe');
    expect(foundDoc.received_cards.length).toBe(1);
    expect(foundDoc.received_cards[0].bulk_card_data.id).toBe(bulkCard.id);
});

test('Fetching from the wrong location returns nothing', async () => {
    const foundDoc: any = await getReceivingById('receiving-id', 'ch2');

    expect(foundDoc).toMatchInlineSnapshot(`
Object {
  "received_cards": Array [],
}
`);
});
