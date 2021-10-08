import { MongoMemoryServer } from 'mongodb-memory-server';
import { FinishSaleCard } from '../common/types';
import getDatabaseConnection from '../database';
import addCardToInventory from './addCardToInventory';
import isValidInventory from './isValidInventory';

let mongoServer;
let db;

// Set up the mongo memory instance
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    db = await getDatabaseConnection(uri);

    // Seed card in inventory with lower quantity
    await addCardToInventory({
        quantity: 2,
        finishCondition: 'NONFOIL_NM',
        id: '49585',
        name: 'MyFooCard',
        set_name: 'MyFooSet',
        set: 'MFS',
        location: 'ch1',
    });
});

afterAll(async () => {
    await mongoServer.stop();
});

test('Validates inventory correctly', async () => {
    const salelistCard: FinishSaleCard = {
        id: '49585',
        price: 3.45,
        qtyToSell: 4,
        finishCondition: 'NONFOIL_NM',
        name: 'MyFooCard',
        set_name: 'MFS',
    };

    const isValid = async () => await isValidInventory(salelistCard, 'ch1');

    /**
     * We access `rejects` here because `toThrow` is used for synchronous functions
     *
     * `.rejects` unwraps the promise rejection reason for testing
     *
     * TODO: Should isValidInventory even throw? Perhaps we should return false.
     * The implementation point is simply a Promise.all() chain testing for truthiness, after all
     */
    expect(isValid).rejects.toThrow();
});
