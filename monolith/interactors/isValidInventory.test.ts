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
        finishCondition: 'FOIL_NM',
        id: '1234',
        name: 'CardName',
        set_name: 'SetName',
        set: 'SNM',
        location: 'ch1',
    });
});

afterAll(async () => {
    await mongoServer.stop();
});

test('Validates inventory correctly', async () => {
    const salelistCard: FinishSaleCard = {
        id: '1234',
        price: 3.45,
        qtyToSell: 4,
        finishCondition: 'FOIL_NM',
        name: 'CardName',
        set_name: 'SNM',
    };

    const isValid = async () => await isValidInventory(salelistCard, 'ch1');

    /**
     * We access `rejects` here because `toThrow` is used for synchronous functions
     *
     * `.rejects` unwraps the promise rejection reason for testing
     */
    expect(isValid).rejects.toThrow();
});
