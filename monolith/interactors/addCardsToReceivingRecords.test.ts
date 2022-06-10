import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { Trade } from '../common/types';
import Connection from '../database';
import addCardsToReceivingRecords from './addCardsToReceivingRecords';
import { ReceivingCard } from './addCardToInventoryReceiving';

let mongoServer;
let db;

// Set up the mongo memory instance
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await Connection.open(uri);
    db = mongoose.connection.db;
});

afterAll(async () => {
    await mongoServer.stop();
});

test('Add a single receiving record', async () => {
    const tradeMetadata = {
        cashPrice: 0,
        creditPrice: 1.23,
        marketPrice: 0,
        tradeType: Trade.Credit,
    };

    const receivingCards: ReceivingCard[] = [
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
    ];

    await addCardsToReceivingRecords({
        cards: receivingCards,
        employeeNumber: 1337,
        customerContact: '456-789-2345',
        customerName: 'Jane Doe',
        userId: '456-768',
        location: 'ch1',
    });

    const foundDocs = await db.collection('received_cards').find({}).toArray();
    expect(foundDocs.length).toBe(1);

    const wrongLocationCollection = await db
        .collection('received_cards_ch2')
        .find({})
        .toArray();
    expect(wrongLocationCollection.length).toBe(0);

    const doc = foundDocs[0];

    expect(doc.created_by).toMatchInlineSnapshot(`"456-768"`);
    expect(doc.customer_contact).toMatchInlineSnapshot(`"456-789-2345"`);
    expect(doc.customer_contact).toMatchInlineSnapshot(`"456-789-2345"`);
    expect(doc.employee_number).toMatchInlineSnapshot(`1337`);
    expect(doc.received_card_list).toMatchInlineSnapshot(`
Array [
  Object {
    "cashPrice": 0,
    "creditPrice": 1.23,
    "finishCondition": "NONFOIL_NM",
    "id": "3678",
    "marketPrice": 0,
    "name": "Black Lotus",
    "quantity": 1,
    "set": "LEA",
    "set_name": "Limted Edition Alpha",
    "tradeType": "CREDIT",
  },
  Object {
    "cashPrice": 0,
    "creditPrice": 1.23,
    "finishCondition": "NONFOIL_NM",
    "id": "2386",
    "marketPrice": 0,
    "name": "Mox Diamond",
    "quantity": 4,
    "set": "STH",
    "set_name": "Stronghold",
    "tradeType": "CREDIT",
  },
  Object {
    "cashPrice": 0,
    "creditPrice": 1.23,
    "finishCondition": "ETCHED_LP",
    "id": "9987",
    "marketPrice": 0,
    "name": "Mox Diamond",
    "quantity": 7,
    "set": "STH",
    "set_name": "Stronghold",
    "tradeType": "CREDIT",
  },
]
`);
});

test('Receive more', async () => {
    const tradeMetadata = {
        cashPrice: 0,
        creditPrice: 1.23,
        marketPrice: 0,
        tradeType: Trade.Credit,
    };

    const receiveMore: ReceivingCard[] = [
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

    await addCardsToReceivingRecords({
        cards: receiveMore,
        employeeNumber: 1337,
        customerContact: '456-789-2345',
        customerName: 'Jane Doe',
        userId: '456-768',
        location: 'ch1',
    });

    const foundDocs = await db.collection('received_cards').find({}).toArray();
    expect(foundDocs.length).toBe(2);

    const wrongLocationCollection = await db
        .collection('received_cards_ch2')
        .find({})
        .toArray();
    expect(wrongLocationCollection.length).toBe(0);

    const doc = foundDocs[1];

    expect(doc.created_by).toMatchInlineSnapshot(`"456-768"`);
    expect(doc.customer_contact).toMatchInlineSnapshot(`"456-789-2345"`);
    expect(doc.customer_contact).toMatchInlineSnapshot(`"456-789-2345"`);
    expect(doc.employee_number).toMatchInlineSnapshot(`1337`);
    expect(doc.received_card_list).toMatchInlineSnapshot(`
Array [
  Object {
    "cashPrice": 0,
    "creditPrice": 1.23,
    "finishCondition": "NONFOIL_NM",
    "id": "3678",
    "marketPrice": 0,
    "name": "Black Lotus",
    "quantity": 1,
    "set": "LEA",
    "set_name": "Limted Edition Alpha",
    "tradeType": "CREDIT",
  },
  Object {
    "cashPrice": 0,
    "creditPrice": 1.23,
    "finishCondition": "NONFOIL_NM",
    "id": "2386",
    "marketPrice": 0,
    "name": "Mox Diamond",
    "quantity": 4,
    "set": "STH",
    "set_name": "Stronghold",
    "tradeType": "CREDIT",
  },
  Object {
    "cashPrice": 0,
    "creditPrice": 1.23,
    "finishCondition": "FOIL_NM",
    "id": "3456",
    "marketPrice": 0,
    "name": "Crystal Quarry",
    "quantity": 2,
    "set": "ODY",
    "set_name": "Odyssey",
    "tradeType": "CREDIT",
  },
]
`);
});
