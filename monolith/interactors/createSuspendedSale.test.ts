import { MongoMemoryServer } from 'mongodb-memory-server';
import { FinishSaleCard } from '../common/types';
import getDatabaseConnection from '../database';
import addCardToInventory from './addCardToInventory';
import createSuspendedSale from './createSuspendedSale';

let mongoServer;
let db;

// Set up the mongo memory instance
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    db = await getDatabaseConnection(uri);

    // Seed inventory with data
    await addCardToInventory({
        quantity: 4,
        finishCondition: 'NONFOIL_NM',
        id: '2345',
        name: 'Card Name',
        set_name: 'Set Name',
        set: 'SNM',
        location: 'ch1',
    });
});

afterAll(async () => {
    await mongoServer.stop();
});

test('Suspending sale with invalid available inventory', async () => {
    let error: Error;

    const saleListCards: FinishSaleCard[] = [
        {
            id: '2345',
            price: 2.34,
            qtyToSell: 5,
            finishCondition: 'NONFOIL_NM',
            name: 'Card Name',
            set_name: 'SNM',
        },
    ];

    try {
        await createSuspendedSale(
            'Johnny Coder',
            'Some notes here',
            saleListCards,
            'ch1'
        );
    } catch (e) {
        error = e;
    }

    expect(error.message).toBe(`Card Name's QOH of 5 exceeds inventory of 4`);
});

test('Suspending sale with available inventory', async () => {
    const saleListCards: FinishSaleCard[] = [
        {
            id: '2345',
            price: 2.34,
            qtyToSell: 1,
            finishCondition: 'NONFOIL_NM',
            name: 'Card Name',
            set_name: 'SNM',
        },
    ];

    await createSuspendedSale(
        'Johnny Coder',
        'Some notes here',
        saleListCards,
        'ch1'
    );

    const foundDoc = await db
        .collection('card_inventory')
        .findOne({ _id: '2345' });

    expect(foundDoc).toMatchInlineSnapshot(`
Object {
  "_id": "2345",
  "name": "Card Name",
  "qoh": Object {
    "NONFOIL_NM": 3,
  },
  "set": "SNM",
  "set_name": "Set Name",
}
`);
});
