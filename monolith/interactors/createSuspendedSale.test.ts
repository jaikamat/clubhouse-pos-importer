import { MongoMemoryServer } from 'mongodb-memory-server';
import { FinishSaleCard } from '../common/types';
import getDatabaseConnection from '../database';
import timeSpiral from '../fixtures/fixtures';
import addCardToInventory from './addCardToInventory';
import createSuspendedSale from './createSuspendedSale';

let mongoServer;
let db;
const bulkId = timeSpiral.id;

// Set up the mongo memory instance
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    db = await getDatabaseConnection(uri);

    // Seed bulk data
    await db.collection('scryfall_bulk_cards').bulkWrite([
        {
            updateOne: {
                filter: { _id: bulkId }, // upsert the inserted cards to have a String _id rather than ObjectId
                update: {
                    $set: { ...timeSpiral },
                },
                upsert: true,
            },
        },
    ]);

    // Seed inventory with data
    await addCardToInventory({
        quantity: 4,
        finishCondition: 'NONFOIL_NM',
        id: bulkId,
        name: timeSpiral.name,
        set_name: timeSpiral.set_name,
        set: timeSpiral.set,
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
            id: bulkId,
            price: 2.34,
            qtyToSell: 5,
            finishCondition: 'NONFOIL_NM',
            name: timeSpiral.name,
            set_name: timeSpiral.set,
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

    expect(error.message).toBe(`Time Spiral's QOH of 5 exceeds inventory of 4`);
});

test('Suspending sale with available inventory', async () => {
    const saleListCards: FinishSaleCard[] = [
        {
            id: bulkId,
            price: 2.34,
            qtyToSell: 1,
            finishCondition: 'NONFOIL_NM',
            name: timeSpiral.name,
            set_name: timeSpiral.set,
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
        .findOne({ _id: bulkId });

    expect(foundDoc).toMatchInlineSnapshot(`
Object {
  "_id": "f3d62dbd-63db-4ac9-950f-9852627f23f2",
  "name": "Time Spiral",
  "qoh": Object {
    "NONFOIL_NM": 3,
  },
  "set": "usg",
  "set_name": "Urza's Saga",
}
`);
});
