const { MongoMemoryServer } = require('mongodb-memory-server');
const {
    default: wrapAddCardToInventoryReceiving,
} = require('../built/interactors/addCardToInventoryReceiving');
const getDatabaseConnection = require('../built/database').default;

let mongoServer;
let db;

// Set up the mongo memory instance
beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const uri = await mongoServer.getUri();
    db = await getDatabaseConnection(uri);
});

test('Receive one', async () => {
    await wrapAddCardToInventoryReceiving(
        [
            {
                quantity: 1,
                finishCondition: 'NONFOIL_NM',
                id: '3678',
                name: 'Black Lotus',
                set_name: 'Limted Edition Alpha',
                set: 'LEA',
            },
            {
                quantity: 4,
                finishCondition: 'NONFOIL_NM',
                id: '2386',
                name: 'Mox Diamond',
                set_name: 'Stronghold',
                set: 'STH',
            },
        ],
        'ch1'
    );

    // ch1 uses `card_inventory`, ch2 uses `card_inventory_ch2`
    const foundDocs = await db.collection('card_inventory').find({}).toArray();

    expect(foundDocs).toMatchInlineSnapshot(`
        Array [
          Object {
            "_id": "3678",
            "name": "Black Lotus",
            "qoh": Object {
              "NONFOIL_NM": 1,
            },
            "set": "LEA",
            "set_name": "Limted Edition Alpha",
          },
          Object {
            "_id": "2386",
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
            id: '3678',
            name: 'Black Lotus',
            set_name: 'Limted Edition Alpha',
            set: 'LEA',
        },
        {
            quantity: 4,
            finishCondition: 'NONFOIL_NM',
            id: '2386',
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
    const foundDocs = await db.collection('card_inventory').find({}).toArray();

    expect(foundDocs).toMatchInlineSnapshot(`
        Array [
          Object {
            "_id": "3678",
            "name": "Black Lotus",
            "qoh": Object {
              "NONFOIL_NM": 2,
            },
            "set": "LEA",
            "set_name": "Limted Edition Alpha",
          },
          Object {
            "_id": "2386",
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
