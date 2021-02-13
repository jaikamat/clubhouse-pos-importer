const { ExpectationFailed } = require('http-errors');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
// TODO: We currently require in the built code. We should be requiring the TS file,
// but this will require some finagling with tooling configs
const {
    default: addCardToInventory,
} = require('../built/interactors/addCardToInventory');

let mongoServer;
let client;
const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const PROD_DB = 'clubhouse_collection_production';

// Set up the mongo memory instance
beforeEach(async () => {
    mongoServer = new MongoMemoryServer();
    // Interactors use this to establish a connection
    process.env.MONGO_URI = await mongoServer.getUri();

    // Establish our own connection outside of interactors to inspect db
    client = await new MongoClient.connect(process.env.MONGO_URI, mongoOptions);
});

afterEach(async () => {
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
    const foundDoc = await client
        .db(PROD_DB)
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
        id: '1234',
        name: 'CardName',
        set_name: 'SetName',
        set: 'SNM',
        location: 'ch1',
    });

    // Second addition
    await addCardToInventory({
        quantity: -2,
        finishCondition: 'FOIL_NM',
        id: '1234',
        name: 'CardName',
        set_name: 'SetName',
        set: 'SNM',
        location: 'ch1',
    });

    const foundDoc = await client
        .db(PROD_DB)
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

    const foundDoc = await client
        .db(PROD_DB)
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

    const foundDoc = await client
        .db(PROD_DB)
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
