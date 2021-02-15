const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
const {
    default: addCardToInventory,
} = require('../built/interactors/addCardToInventory');
const {
    updateInventoryCards,
} = require('../built/interactors/updateInventoryCards');

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

test('Ensure multiple update', async () => {
    await addCardToInventory({
        quantity: 1,
        finishCondition: 'NONFOIL_NM',
        id: '1234',
        name: 'Black Lotus',
        set_name: 'Limted Edition Alpha',
        set: 'LEA',
        location: 'ch1',
    });

    await addCardToInventory({
        quantity: 4,
        finishCondition: 'NONFOIL_NM',
        id: '2345',
        name: 'Mox Diamond',
        set_name: 'Stronghold',
        set: 'STH',
        location: 'ch1',
    });

    const cardsInSale = [
        {
            qtyToSell: 1,
            finishCondition: 'NONFOIL_NM',
            id: '1234',
            name: 'Black Lotus',
        },
        {
            qtyToSell: 3,
            finishCondition: 'NONFOIL_NM',
            id: '2345',
            name: 'Mox Diamond',
        },
    ];

    await updateInventoryCards(cardsInSale, 'ch1');

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
              "NONFOIL_NM": 0,
            },
            "set": "LEA",
            "set_name": "Limted Edition Alpha",
          },
          Object {
            "_id": "2345",
            "name": "Mox Diamond",
            "qoh": Object {
              "NONFOIL_NM": 1,
            },
            "set": "STH",
            "set_name": "Stronghold",
          },
        ]
    `);
});
