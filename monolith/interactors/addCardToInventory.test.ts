import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Connection from '../database';
import addCardToInventory from './addCardToInventory';

let mongoServer;
let db;

// Set up the mongo memory instance
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await Connection.open(uri);
    db = mongoose.connection.db;
});

afterAll(async () => {
    await mongoServer.stop();
});

test('Single card addition', async () => {
    await addCardToInventory({
        quantity: 2,
        finishCondition: 'FOIL_NM',
        id: '1234',
        name: 'CardName',
        set_name: 'SetName',
        set: 'SNM',
        location: 'ch1',
    });

    // ch1 uses `card_inventory`, ch2 uses `card_inventory_ch2`
    const foundDoc = await db
        .collection('card_inventory')
        .findOne({ _id: '1234' });

    expect(foundDoc).toMatchInlineSnapshot(`
        Object {
          "_id": "1234",
          "name": "CardName",
          "qoh": Object {
            "FOIL_NM": 2,
          },
          "set": "SNM",
          "set_name": "SetName",
        }
    `);
});

test('Multiple card additions', async () => {
    // First addition
    await addCardToInventory({
        quantity: 2,
        finishCondition: 'FOIL_NM',
        id: '2345',
        name: 'CardName',
        set_name: 'SetName',
        set: 'SNM',
        location: 'ch1',
    });

    // Second addition
    await addCardToInventory({
        quantity: -2,
        finishCondition: 'FOIL_NM',
        id: '2345',
        name: 'CardName',
        set_name: 'SetName',
        set: 'SNM',
        location: 'ch1',
    });

    // Third addition
    await addCardToInventory({
        quantity: 5,
        finishCondition: 'ETCHED_LP',
        id: '2345',
        name: 'CardName',
        set_name: 'SetName',
        set: 'SNM',
        location: 'ch1',
    });

    const foundDoc = await db
        .collection('card_inventory')
        .findOne({ _id: '2345' });

    expect(foundDoc).toMatchInlineSnapshot(`
Object {
  "_id": "2345",
  "name": "CardName",
  "qoh": Object {
    "ETCHED_LP": 5,
    "FOIL_NM": 0,
  },
  "set": "SNM",
  "set_name": "SetName",
}
`);
});

test('Attempt negative card addition', async () => {
    // First addition
    await addCardToInventory({
        quantity: 2,
        finishCondition: 'FOIL_NM',
        id: '1234',
        name: 'CardName',
        set_name: 'SetName',
        set: 'SNM',
        location: 'ch1',
    });

    // Second addition
    await addCardToInventory({
        quantity: -5,
        finishCondition: 'FOIL_NM',
        id: '1234',
        name: 'CardName',
        set_name: 'SetName',
        set: 'SNM',
        location: 'ch1',
    });

    const foundDoc = await db
        .collection('card_inventory')
        .findOne({ _id: '1234' });

    expect(foundDoc).toMatchInlineSnapshot(`
        Object {
          "_id": "1234",
          "name": "CardName",
          "qoh": Object {
            "FOIL_NM": 0,
          },
          "set": "SNM",
          "set_name": "SetName",
        }
    `);
});

test('Attempt negative etched card addition', async () => {
    // First addition
    await addCardToInventory({
        quantity: 2,
        finishCondition: 'ETCHED_NM',
        id: '5678',
        name: 'CardName',
        set_name: 'SetName',
        set: 'SNM',
        location: 'ch1',
    });

    // Second addition
    await addCardToInventory({
        quantity: -5,
        finishCondition: 'ETCHED_NM',
        id: '5678',
        name: 'CardName',
        set_name: 'SetName',
        set: 'SNM',
        location: 'ch1',
    });

    const foundDoc = await db
        .collection('card_inventory')
        .findOne({ _id: '5678' });

    expect(foundDoc).toMatchInlineSnapshot(`
        Object {
          "_id": "5678",
          "name": "CardName",
          "qoh": Object {
            "ETCHED_NM": 0,
          },
          "set": "SNM",
          "set_name": "SetName",
        }
    `);
});

test('Multiple finish conditions', async () => {
    // First addition
    await addCardToInventory({
        quantity: 2,
        finishCondition: 'FOIL_NM',
        id: '1234',
        name: 'CardName',
        set_name: 'SetName',
        set: 'SNM',
        location: 'ch1',
    });

    // Second addition
    await addCardToInventory({
        quantity: 5,
        finishCondition: 'NONFOIL_HP',
        id: '1234',
        name: 'CardName',
        set_name: 'SetName',
        set: 'SNM',
        location: 'ch1',
    });

    // Third addition
    await addCardToInventory({
        quantity: 3,
        finishCondition: 'FOIL_NM',
        id: '1234',
        name: 'CardName',
        set_name: 'SetName',
        set: 'SNM',
        location: 'ch1',
    });

    const foundDoc = await db
        .collection('card_inventory')
        .findOne({ _id: '1234' });

    expect(foundDoc).toMatchInlineSnapshot(`
        Object {
          "_id": "1234",
          "name": "CardName",
          "qoh": Object {
            "FOIL_NM": 5,
            "NONFOIL_HP": 5,
          },
          "set": "SNM",
          "set_name": "SetName",
        }
    `);
});
