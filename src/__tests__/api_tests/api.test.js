process.env.REACT_APP_ENVIRONMENT = 'development'; // Must set dev enviroment so we don't hit production!

const {
    ADD_CARD_TO_INVENTORY,
    GET_CARDS_WITH_INFO,
    LOGIN
} = require('../../utils/api_resources');

const axios = require('axios');

let authToken;
const TIMEOUT = 20000;

describe('Ensure development API is being hit', () => {
    test('ADD_CARD_TO_INVENTORY should be _test', () => {
        expect(ADD_CARD_TO_INVENTORY).toEqual(`https://us-central1-clubhouse-collection.cloudfunctions.net/addCardToInventory_test`);
    }, TIMEOUT);

    test('GET_CARDS_WITH_INFO should be _test', () => {
        expect(GET_CARDS_WITH_INFO).toEqual(`https://us-central1-clubhouse-collection.cloudfunctions.net/getCardsWithInfo_test`);
    }, TIMEOUT);

    test('LOGIN should be _test', () => {
        expect(LOGIN).toEqual(`https://us-central1-clubhouse-collection.cloudfunctions.net/getJwt_test`);
    }, TIMEOUT);
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
    }, TIMEOUT)

    test('Getting a card', async () => {
        const CARD_TITLE = 'Birds of Paradise';

        const { data } = await axios.get(GET_CARDS_WITH_INFO, {
            params: { title: CARD_TITLE, matchInStock: false }
        });

        expect(data.length).toBeGreaterThan(20); // There are more than 20 printings of BoP in MTG

        // All cards should be named CARD_TITLE
        for (let card of data) { expect(card.name).toBe(CARD_TITLE); }
    }, TIMEOUT)

    test('Adding some cards', async () => {
        const CARD_TITLE = 'Catalog';

        // Get card data
        const { data } = await axios.get(GET_CARDS_WITH_INFO, {
            params: { title: CARD_TITLE, matchInStock: false }
        });

        const firstCard = data[0]; // Use the first card's data
        const quantityToAdd = 4; // Choose a quantity to add
        const finishCondition = 'NONFOIL_NM'; // Select a finsh condition to use
        const initialQOH = firstCard.qoh;

        // Add the cards to inventory
        const addToInventoryRes = await axios.post(ADD_CARD_TO_INVENTORY, {
            quantity: quantityToAdd,
            finishCondition: finishCondition,
            cardInfo: { ...firstCard },
        }, { headers: { Authorization: `Bearer ${authToken}` } });

        const newQOH = addToInventoryRes.data.qoh; // Store the response's quantity

        expect(newQOH[finishCondition]).toBe(initialQOH[finishCondition] + quantityToAdd);

        // Reach back out to API for the quantity to be sure
        const confirmNewQoh = await axios.get(GET_CARDS_WITH_INFO, {
            params: { title: CARD_TITLE, matchInStock: false }
        });

        const confirmedQty = confirmNewQoh.data[0].qoh; // Store the quantity

        expect(confirmedQty[finishCondition]).toBe(initialQOH[finishCondition] + quantityToAdd);
    }, TIMEOUT)

    test('Removing some cards', async () => {
        const CARD_TITLE = 'Catalog';

        // Get card data
        const { data } = await axios.get(GET_CARDS_WITH_INFO, {
            params: { title: CARD_TITLE, matchInStock: false }
        });

        const firstCard = data[0]; // Use the first card's data
        const quantityToSubtract = 4; // Choose a quantity to remove
        const finishCondition = 'NONFOIL_NM'; // Select a finsh condition to use
        const initialQOH = firstCard.qoh;

        // Add the cards to inventory
        const addToInventoryRes = await axios.post(ADD_CARD_TO_INVENTORY, {
            quantity: -quantityToSubtract, // Negative qty
            finishCondition: finishCondition,
            cardInfo: { ...firstCard },
        }, { headers: { Authorization: `Bearer ${authToken}` } });

        const newQOH = addToInventoryRes.data.qoh; // Store the response's quantity

        expect(newQOH[finishCondition]).toBe(initialQOH[finishCondition] - quantityToSubtract);

        // Reach back out to API for the quantity to be sure
        const confirmNewQoh = await axios.get(GET_CARDS_WITH_INFO, {
            params: { title: CARD_TITLE, matchInStock: false }
        });

        const confirmedQty = confirmNewQoh.data[0].qoh; // Store the quantity

        expect(confirmedQty[finishCondition]).toBe(initialQOH[finishCondition] - quantityToSubtract);
    }, TIMEOUT)

    test('Ensure quantites not negative', async () => {
        const CARD_TITLE = 'Catalog';

        // Get card data
        const { data } = await axios.get(GET_CARDS_WITH_INFO, {
            params: { title: CARD_TITLE, matchInStock: false }
        });

        const firstCard = data[0]; // Use the first card's data
        const finishCondition = 'NONFOIL_NM'; // Select a finsh condition to use
        const initialQOH = firstCard.qoh; // Store the initial quantity on hand
        const negativeQOH = initialQOH[finishCondition] + 1; // Make the desired quantity attempt forcing a negative

        // Add the cards to inventory
        const addToInventoryRes = await axios.post(ADD_CARD_TO_INVENTORY, {
            quantity: -negativeQOH, // Try to remove more than what is on hand
            finishCondition: finishCondition,
            cardInfo: { ...firstCard },
        }, { headers: { Authorization: `Bearer ${authToken}` } });

        const newQOH = addToInventoryRes.data.qoh; // Store the response's quantity

        expect(newQOH[finishCondition]).toBeGreaterThanOrEqual(0);
    }, TIMEOUT)
})
