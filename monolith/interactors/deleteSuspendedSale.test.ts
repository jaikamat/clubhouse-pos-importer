import { MongoMemoryServer } from 'mongodb-memory-server';
import { FinishSaleCard } from '../common/types';
import getDatabaseConnection from '../database';
import timeSpiral from '../fixtures/fixtures';
import collectionFromLocation from '../lib/collectionFromLocation';
import addCardToInventory from './addCardToInventory';
import createSuspendedSale from './createSuspendedSale';
import deleteSuspendedSale from './deleteSuspendedSale';
import getSuspendedSales from './getSuspendedSales';

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

    const saleListCards: FinishSaleCard[] = [
        {
            id: bulkId,
            price: 2.34,
            qtyToSell: 2,
            finishCondition: 'NONFOIL_NM',
            name: timeSpiral.name,
            set_name: timeSpiral.set_name,
        },
    ];

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

    // Create suspended sale
    await createSuspendedSale(
        'Johnny Coder',
        'Some notes here',
        saleListCards,
        'ch1'
    );
});

afterAll(async () => {
    await mongoServer.stop();
});

test('Deleting suspended sale restores inventory', async () => {
    const suspendedSales = await getSuspendedSales('ch1');
    expect(suspendedSales.length).toBe(1);

    const suspendedSaleId = suspendedSales[0]._id;

    const beforeSuspendDoc = await db
        .collection(collectionFromLocation('ch1').cardInventory)
        .findOne({ _id: bulkId });

    expect(beforeSuspendDoc.qoh.NONFOIL_NM).toBe(2);

    await deleteSuspendedSale(suspendedSaleId, 'ch1');

    const afterSuspendDoc = await db
        .collection(collectionFromLocation('ch1').cardInventory)
        .findOne({ _id: bulkId });

    expect(afterSuspendDoc.qoh.NONFOIL_NM).toBe(4);
});
