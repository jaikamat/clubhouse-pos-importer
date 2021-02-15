const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
const {
    default: wrapAddCardToInventoryReceiving,
} = require('../built/interactors/addCardToInventoryReceiving');

let mongoServer;
let client;
const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const PROD_DB = 'clubhouse_collection_production';

// Set up the mongo memory instance
beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    // Interactors use this to establish a connection
    process.env.MONGO_URI = await mongoServer.getUri();

    // Establish our own connection outside of interactors to inspect db
    client = await new MongoClient.connect(process.env.MONGO_URI, mongoOptions);
});

afterAll(async () => {
    await mongoServer.stop();
});

test('Receive one', async () => {
    await wrapAddCardToInventoryReceiving(
        [
            {
                quantity: 1,
                finishCondition: 'NONFOIL_NM',
                id: '1234',
                name: 'Black Lotus',
                set_name: 'Limted Edition Alpha',
                set: 'LEA',
            },
            {
                quantity: 4,
                finishCondition: 'NONFOIL_NM',
                id: '2345',
                name: 'Mox Diamond',
                set_name: 'Stronghold',
                set: 'STH',
            },
        ],
        'ch1'
    );

    // ch1 uses `card_inventory`, ch2 uses `card_inventory_ch2`
    const foundDocs = await client
        .db(PROD_DB)
        .collection('card_inventory')
        .find({})
        .toArray();

    expect(foundDocs).toMatchInlineSnapshot(`
        Array [
          Object {
            "_id": "1234",
            "name": "Black Lotus",
            "qoh": Object {
              "NONFOIL_NM": 1,
            },
            "set": "LEA",
            "set_name": "Limted Edition Alpha",
          },
          Object {
            "_id": "2345",
            "name": "Mox Diamond",
            "qoh": Object {
              "NONFOIL_NM": 4,
            },
            "set": "STH",
            "set_name": "Stronghold",
          },
        ]
    `);
});

test('Receive more', async () => {
    const receiveMore = [
        {
            quantity: 1,
            finishCondition: 'NONFOIL_NM',
            id: '1234',
            name: 'Black Lotus',
            set_name: 'Limted Edition Alpha',
            set: 'LEA',
        },
        {
            quantity: 4,
            finishCondition: 'NONFOIL_NM',
            id: '2345',
            name: 'Mox Diamond',
            set_name: 'Stronghold',
            set: 'STH',
        },
        {
            quantity: 2,
            finishCondition: 'FOIL_NM',
            id: '3456',
            name: 'Crystal Quarry',
            set_name: 'Odyssey',
            set: 'ODY',
        },
    ];

    await wrapAddCardToInventoryReceiving(receiveMore, 'ch1');

    // ch1 uses `card_inventory`, ch2 uses `card_inventory_ch2`
    const foundDocs = await client
        .db(PROD_DB)
        .collection('card_inventory')
        .find({})
        .toArray();

    expect(foundDocs).toMatchInlineSnapshot(`
        Array [
          Object {
            "_id": "1234",
            "name": "Black Lotus",
            "qoh": Object {
              "NONFOIL_NM": 2,
            },
            "set": "LEA",
            "set_name": "Limted Edition Alpha",
          },
          Object {
            "_id": "2345",
            "name": "Mox Diamond",
            "qoh": Object {
              "NONFOIL_NM": 8,
            },
            "set": "STH",
            "set_name": "Stronghold",
          },
          Object {
            "_id": "3456",
            "name": "Crystal Quarry",
            "qoh": Object {
              "FOIL_NM": 2,
            },
            "set": "ODY",
            "set_name": "Odyssey",
          },
        ]
    `);
});
