import { MongoMemoryServer } from 'mongodb-memory-server';
import { FinishSaleCard } from '../common/types';
import getDatabaseConnection from '../database';
import addCardToInventory from './addCardToInventory';
import { updateInventoryCards } from './updateInventoryCards';

let mongoServer;
let db;

// Set up the mongo memory instance
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
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

    const cardsInSale: FinishSaleCard[] = [
        {
            qtyToSell: 1,
            finishCondition: 'NONFOIL_NM',
            id: '1337',
            name: 'Black Lotus',
            price: 1.23,
            set_name: 'LEA',
        },
        {
            qtyToSell: 3,
            finishCondition: 'NONFOIL_NM',
            id: '5699',
            name: 'Mox Diamond',
            price: 1.23,
            set_name: 'STH',
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
