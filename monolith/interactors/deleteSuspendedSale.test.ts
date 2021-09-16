import { MongoMemoryServer } from 'mongodb-memory-server';
import { FinishSaleCard } from '../common/types';
import getDatabaseConnection from '../database';
import collectionFromLocation from '../lib/collectionFromLocation';
import addCardToInventory from './addCardToInventory';
import createSuspendedSale from './createSuspendedSale';
import deleteSuspendedSale from './deleteSuspendedSale';
import getSuspendedSales from './getSuspendedSales';

let mongoServer;
let db;

// Set up the mongo memory instance
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    db = await getDatabaseConnection(uri);

    const saleListCards: FinishSaleCard[] = [
        {
            id: '4567',
            price: 2.34,
            qtyToSell: 2,
            finishCondition: 'NONFOIL_NM',
            name: 'Card Name',
            set_name: 'SNM',
        },
    ];

    // Seed inventory with data
    await addCardToInventory({
        quantity: 4,
        finishCondition: 'NONFOIL_NM',
        id: '4567',
        name: 'Card Name',
        set_name: 'Set Name',
        set: 'SNM',
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
        .findOne({ _id: '4567' });

    expect(beforeSuspendDoc.qoh.NONFOIL_NM).toBe(2);

    await deleteSuspendedSale(suspendedSaleId, 'ch1');

    const afterSuspendDoc = await db
        .collection(collectionFromLocation('ch1').cardInventory)
        .findOne({ _id: '4567' });

    expect(afterSuspendDoc.qoh.NONFOIL_NM).toBe(4);
});
