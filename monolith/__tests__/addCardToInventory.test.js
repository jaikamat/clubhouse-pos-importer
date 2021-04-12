const { MongoMemoryServer } = require('mongodb-memory-server');
// TODO: We currently require in the built code. We should be requiring the TS file,
// but this will require some finagling with tooling configs
const {
    default: addCardToInventory,
} = require('../built/interactors/addCardToInventory');
const getDatabaseConnection = require('../built/database').default;

let mongoServer;
let db;

// Set up the mongo memory instance
beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const uri = await mongoServer.getUri();
    db = await getDatabaseConnection(uri);
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

    const foundDoc = await db
        .collection('card_inventory')
        .findOne({ _id: '2345' });

    expect(foundDoc).toMatchInlineSnapshot(`
        Object {
          "_id": "2345",
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
