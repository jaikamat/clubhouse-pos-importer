import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { Connection } from '../database';
import addCardToInventory from './addCardToInventory';
import getDistinctSetNames from './getDistinctSetNames';

const SCRYFALL_BULK = 'scryfall_bulk_cards';

let mongoServer;
let db;

// Set up the mongo memory instance
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await Connection.open(uri);
    db = mongoose.connection.db;

    // Add some cards to store inventory collection with differing set namees
    const inserts = [
        'foo',
        'bar',
        'baz',
        'bin',
        'repeat',
        'woot',
        'nub',
        'repeat',
    ].map((el) => {
        return addCardToInventory({
            quantity: 4,
            finishCondition: 'FOIL_NM',
            id: Math.random().toString(),
            name: el,
            set_name: el,
            set: el,
            location: 'ch1',
        });
    });

    await Promise.all(inserts);
});

afterAll(async () => {
    await mongoServer.stop();
});

test('Get all the unique set names', async () => {
    const ch1Names = await getDistinctSetNames('ch1');
    const ch2Names = await getDistinctSetNames('ch2');

    expect({ ch1Names, ch2Names }).toMatchInlineSnapshot(`
Object {
  "ch1Names": Array [
    "bar",
    "baz",
    "bin",
    "foo",
    "nub",
    "repeat",
    "woot",
  ],
  "ch2Names": Array [],
}
`);
});
