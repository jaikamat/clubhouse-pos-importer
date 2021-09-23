import { MongoMemoryServer } from 'mongodb-memory-server';
import { Trade } from '../common/types';
import getDatabaseConnection from '../database';
import addCardToInventoryReceiving from './addCardToInventoryReceiving';

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

test('Receive one', async () => {
    const tradeMetadata = {
        cashPrice: 0,
        creditPrice: 1.23,
        marketPrice: 0,
        tradeType: Trade.Credit,
    };

    await addCardToInventoryReceiving(
        [
            {
                quantity: 1,
                finishCondition: 'NONFOIL_NM',
                id: '3678',
                name: 'Black Lotus',
                set_name: 'Limted Edition Alpha',
                set: 'LEA',
                ...tradeMetadata,
            },
            {
                quantity: 4,
                finishCondition: 'NONFOIL_NM',
                id: '2386',
                name: 'Mox Diamond',
                set_name: 'Stronghold',
                set: 'STH',
                ...tradeMetadata,
            },
            {
                quantity: 7,
                finishCondition: 'ETCHED_LP',
                id: '9987',
                name: 'Mox Diamond',
                set_name: 'Stronghold',
                set: 'STH',
                ...tradeMetadata,
            },
        ],
        'ch1'
    );

    // ch1 uses `card_inventory`, ch2 uses `card_inventory_ch2`
    const foundDocs = await db.collection('card_inventory').find({}).toArray();

    expect(foundDocs.length).toBe(3);

    expect(foundDocs).toContainEqual({
        _id: '3678',
        name: 'Black Lotus',
        qoh: {
            NONFOIL_NM: 1,
        },
        set: 'LEA',
        set_name: 'Limted Edition Alpha',
    });

    expect(foundDocs).toContainEqual({
        _id: '2386',
        name: 'Mox Diamond',
        qoh: {
            NONFOIL_NM: 4,
        },
        set: 'STH',
        set_name: 'Stronghold',
    });

    expect(foundDocs).toContainEqual({
        _id: '9987',
        name: 'Mox Diamond',
        qoh: {
            ETCHED_LP: 7,
        },
        set: 'STH',
        set_name: 'Stronghold',
    });
});

test('Receive more', async () => {
    const tradeMetadata = {
        cashPrice: 0,
        creditPrice: 1.23,
        marketPrice: 0,
        tradeType: Trade.Credit,
    };

    const receiveMore = [
        {
            quantity: 1,
            finishCondition: 'NONFOIL_NM',
            id: '3678',
            name: 'Black Lotus',
            set_name: 'Limted Edition Alpha',
            set: 'LEA',
            ...tradeMetadata,
        },
        {
            quantity: 4,
            finishCondition: 'NONFOIL_NM',
            id: '2386',
            name: 'Mox Diamond',
            set_name: 'Stronghold',
            set: 'STH',
            ...tradeMetadata,
        },
        {
            quantity: 2,
            finishCondition: 'FOIL_NM',
            id: '3456',
            name: 'Crystal Quarry',
            set_name: 'Odyssey',
            set: 'ODY',
            ...tradeMetadata,
        },
    ];

    await addCardToInventoryReceiving(receiveMore, 'ch1');

    // ch1 uses `card_inventory`, ch2 uses `card_inventory_ch2`
    const foundDocs = await db.collection('card_inventory').find({}).toArray();

    expect(foundDocs.length).toBe(4);

    expect(foundDocs).toContainEqual({
        _id: '3678',
        name: 'Black Lotus',
        qoh: {
            NONFOIL_NM: 2,
        },
        set: 'LEA',
        set_name: 'Limted Edition Alpha',
    });

    expect(foundDocs).toContainEqual({
        _id: '2386',
        name: 'Mox Diamond',
        qoh: {
            NONFOIL_NM: 8,
        },
        set: 'STH',
        set_name: 'Stronghold',
    });

    expect(foundDocs).toContainEqual({
        _id: '3456',
        name: 'Crystal Quarry',
        qoh: {
            FOIL_NM: 2,
        },
        set: 'ODY',
        set_name: 'Odyssey',
    });

    expect(foundDocs).toContainEqual({
        _id: '9987',
        name: 'Mox Diamond',
        qoh: {
            ETCHED_LP: 7,
        },
        set: 'STH',
        set_name: 'Stronghold',
    });
});
