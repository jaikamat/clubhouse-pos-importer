// Must set dev enviroment so we don't hit production!
process.env.REACT_APP_ENVIRONMENT = 'development';

const {
    ADD_CARD_TO_INVENTORY,
    GET_SCRYFALL_BULK_BY_TITLE,
    GET_CARD_QTY_FROM_INVENTORY,
    LOGIN
} = require('../src/api_resources');

const axios = require('axios');

let authToken;

describe('First test', () => {
    test('2 + 2 = 4', () => {
        expect(2 + 2).toEqual(4);
    })
})

describe('Ensure development API is being hit', () => {
    test('ADD_CARD_TO_INVENTORY should be _test', () => {
        expect(ADD_CARD_TO_INVENTORY).toEqual(`https://us-central1-clubhouse-collection.cloudfunctions.net/addCardToInventory_test`);
    });

    test('GET_SCRYFALL_BULK_BY_TITLE should be _test', () => {
        expect(GET_SCRYFALL_BULK_BY_TITLE).toEqual(`https://us-central1-clubhouse-collection.cloudfunctions.net/getScryfallBulkCardsByTitle_test`);
    });

    test('GET_CARD_QTY_FROM_INVENTORY should be _test', () => {
        expect(GET_CARD_QTY_FROM_INVENTORY).toEqual(`https://us-central1-clubhouse-collection.cloudfunctions.net/getCardsFromInventory_test`);
    });

    test('LOGIN should be _test', () => {
        expect(LOGIN).toEqual(`https://us-central1-clubhouse-collection.cloudfunctions.net/getJwt_test`);
    });
})

describe('Add and remove card workflow', () => {
    test('Logging in', async () => {
        const DUMMY_USERNAME = 'mctesterson';
        const DUMMY_PASSWORD = 'tester';

        const { data } = await axios.post(LOGIN, {
            username: DUMMY_USERNAME.toLowerCase(),
            password: DUMMY_PASSWORD
        });

        // Set for continued use in the test suite
        authToken = data.token;

        expect(data.token).not.toBe(null);
    })

    test('Getting a card', async () => {
        const CARD_TITLE = 'Birds of Paradise';

        const { data } = await axios.get(GET_SCRYFALL_BULK_BY_TITLE, {
            params: { title: CARD_TITLE }
        });

        expect(data.length).toBeGreaterThan(20); // There are more than 20 printings of BoP in MTG

        // All cards should be named CARD_TITLE
        for (let card of data) { expect(card.name).toBe(CARD_TITLE); }
    })

    test('Adding some cards', async () => {
        const CARD_TITLE = 'Catalog';

        // Get card data
        const { data } = await axios.get(GET_SCRYFALL_BULK_BY_TITLE, {
            params: { title: CARD_TITLE }
        });

        const firstCard = data[0]; // Use the first card's data
        const firstCardID = firstCard.id; // Grab its ID
        const quantityToAdd = 4; // Choose a quantity to add
        const finishCondition = 'NONFOIL_NM'; // Select a finsh condition to use

        // Get inventory quantites for the chosen cards
        const inventoryRes = await axios.post(
            GET_CARD_QTY_FROM_INVENTORY,
            { scryfallIds: data.map(c => c.id) },
            { headers: { Authorization: `Bearer ${authToken}` } }
        );

        const initialQOH = inventoryRes.data[firstCardID] // Store the initial quantity on hand

        // Add the cards to inventory
        const addToInventoryRes = await axios.post(ADD_CARD_TO_INVENTORY, {
            quantity: quantityToAdd,
            type: finishCondition,
            cardInfo: { ...firstCard },
        }, { headers: { Authorization: `Bearer ${authToken}` } });

        const newQOH = addToInventoryRes.data.qoh; // Store the response's quantity

        expect(newQOH[finishCondition]).toBe(initialQOH[finishCondition] + quantityToAdd);

        // Reach back out to API for the quantity to be sure
        const confirmNewQoh = await axios.post(
            GET_CARD_QTY_FROM_INVENTORY,
            { scryfallIds: data.map(c => c.id) },
            { headers: { Authorization: `Bearer ${authToken}` } }
        );

        const confirmedQty = confirmNewQoh.data[firstCardID][finishCondition]; // Store the quantity

        expect(confirmedQty).toBe(initialQOH[finishCondition] + quantityToAdd);
    })

    test('Removing some cards', async () => {
        const CARD_TITLE = 'Catalog';

        // Get card data
        const { data } = await axios.get(GET_SCRYFALL_BULK_BY_TITLE, {
            params: { title: CARD_TITLE }
        });

        const firstCard = data[0]; // Use the first card's data
        const firstCardID = firstCard.id; // Grab its ID
        const quantityToSubtract = 4; // Choose a quantity to remove
        const finishCondition = 'NONFOIL_NM'; // Select a finsh condition to use

        // Get inventory quantites for the chosen cards
        const inventoryRes = await axios.post(
            GET_CARD_QTY_FROM_INVENTORY,
            { scryfallIds: data.map(c => c.id) },
            { headers: { Authorization: `Bearer ${authToken}` } }
        );

        const initialQOH = inventoryRes.data[firstCardID] // Store the initial quantity on hand

        // Add the cards to inventory
        const addToInventoryRes = await axios.post(ADD_CARD_TO_INVENTORY, {
            quantity: -quantityToSubtract, // Negative qty
            type: finishCondition,
            cardInfo: { ...firstCard },
        }, { headers: { Authorization: `Bearer ${authToken}` } });

        const newQOH = addToInventoryRes.data.qoh; // Store the response's quantity

        expect(newQOH[finishCondition]).toBe(initialQOH[finishCondition] - quantityToSubtract);

        // Reach back out to API for the quantity to be sure
        const confirmNewQoh = await axios.post(
            GET_CARD_QTY_FROM_INVENTORY,
            { scryfallIds: data.map(c => c.id) },
            { headers: { Authorization: `Bearer ${authToken}` } }
        );

        const confirmedQty = confirmNewQoh.data[firstCardID][finishCondition]; // Store the quantity

        expect(confirmedQty).toBe(initialQOH[finishCondition] - quantityToSubtract);
    })

    test('Ensure quantites not negative', async () => {
        const CARD_TITLE = 'Catalog';

        // Get card data
        const { data } = await axios.get(GET_SCRYFALL_BULK_BY_TITLE, {
            params: { title: CARD_TITLE }
        });

        const firstCard = data[0]; // Use the first card's data
        const firstCardID = firstCard.id; // Grab its ID
        const finishCondition = 'NONFOIL_NM'; // Select a finsh condition to use

        // Get inventory quantites for the chosen cards
        const inventoryRes = await axios.post(
            GET_CARD_QTY_FROM_INVENTORY,
            { scryfallIds: data.map(c => c.id) },
            { headers: { Authorization: `Bearer ${authToken}` } }
        );

        const initialQOH = inventoryRes.data[firstCardID] // Store the initial quantity on hand
        const negativeQOH = initialQOH[finishCondition] + 1; // Make the desired quantity attempt forcing a negative

        // Add the cards to inventory
        const addToInventoryRes = await axios.post(ADD_CARD_TO_INVENTORY, {
            quantity: -negativeQOH, // Try to remove more than what is on hand
            type: finishCondition,
            cardInfo: { ...firstCard },
        }, { headers: { Authorization: `Bearer ${authToken}` } });

        const newQOH = addToInventoryRes.data.qoh; // Store the response's quantity

        expect(newQOH[finishCondition]).toBeGreaterThanOrEqual(0);
    })
})
