import { MongoMemoryServer } from 'mongodb-memory-server';
import { Collection } from '../common/types';
import getDatabaseConnection from '../database';
import bulkCard from '../fixtures/fixtures';
import addCardToInventory from './addCardToInventory';
import getCardFromAllLocations from './getCardFromAllLocations';

let mongoServer;
let db;

// Set up the mongo memory instance
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    db = await getDatabaseConnection(uri);
});

afterAll(async () => {
    await mongoServer.stop();
});

test('Correctly returns appropriate inventory quantities', async () => {
    // Seed with bulk card information
    db.collection(Collection.scryfallBulkCards).insert(bulkCard);

    // Seed inventory with data
    const { id, name, set_name, set } = bulkCard;

    await addCardToInventory({
        quantity: 4,
        finishCondition: 'NONFOIL_NM',
        id,
        name,
        set_name,
        set,
        location: 'ch1',
    });

    await addCardToInventory({
        quantity: 1,
        finishCondition: 'NONFOIL_NM',
        id,
        name,
        set_name,
        set,
        location: 'ch1',
    });

    await addCardToInventory({
        quantity: 4,
        finishCondition: 'FOIL_NM',
        id,
        name,
        set_name,
        set,
        location: 'ch1',
    });

    // Seed inventory with data
    await addCardToInventory({
        quantity: 7,
        finishCondition: 'NONFOIL_NM',
        id,
        name,
        set_name,
        set,
        location: 'ch2',
    });

    await addCardToInventory({
        quantity: 2,
        finishCondition: 'ETCHED_HP',
        id,
        name,
        set_name,
        set,
        location: 'ch2',
    });

    const combinedInventory = await getCardFromAllLocations(name);

    expect(combinedInventory).toMatchInlineSnapshot(`
Object {
  "ch1": Object {
    "etchedQty": 0,
    "foilQty": 4,
    "nonfoilQty": 5,
  },
  "ch2": Object {
    "etchedQty": 2,
    "foilQty": 0,
    "nonfoilQty": 7,
  },
}
`);
});
