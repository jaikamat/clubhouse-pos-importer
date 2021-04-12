const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
const {
    default: addCardToInventory,
} = require('../built/interactors/addCardToInventory');
const {
    updateInventoryCards,
} = require('../built/interactors/updateInventoryCards');
const getDatabaseConnection = require('../built/database').default;

let mongoServer;
let db;

// Set up the mongo memory instance
beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const uri = await mongoServer.getUri();
    db = await getDatabaseConnection(uri);
});

afterEach(async () => {
    await mongoServer.stop();
});

test('Ensure multiple update', async () => {
    await addCardToInventory({
        quantity: 1,
        finishCondition: 'NONFOIL_NM',
        id: '1337',
        name: 'Black Lotus',
        set_name: 'Limted Edition Alpha',
        set: 'LEA',
        location: 'ch1',
    });

    await addCardToInventory({
        quantity: 4,
        finishCondition: 'NONFOIL_NM',
        id: '5699',
        name: 'Mox Diamond',
        set_name: 'Stronghold',
        set: 'STH',
        location: 'ch1',
    });

    const cardsInSale = [
        {
            qtyToSell: 1,
            finishCondition: 'NONFOIL_NM',
            id: '1337',
            name: 'Black Lotus',
        },
        {
            qtyToSell: 3,
            finishCondition: 'NONFOIL_NM',
            id: '5699',
            name: 'Mox Diamond',
        },
    ];

    await updateInventoryCards(cardsInSale, 'ch1');

    // ch1 uses `card_inventory`, ch2 uses `card_inventory_ch2`
    const foundDocs = await db.collection('card_inventory').find({}).toArray();

    expect(foundDocs).toMatchInlineSnapshot(`
        Array [
          Object {
            "_id": "1337",
            "name": "Black Lotus",
            "qoh": Object {
              "NONFOIL_NM": 0,
            },
            "set": "LEA",
            "set_name": "Limted Edition Alpha",
          },
          Object {
            "_id": "5699",
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
