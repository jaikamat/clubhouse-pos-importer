process.env.REACT_APP_ENVIRONMENT = 'development';

import axios from 'axios';
const { GET_CARDS_WITH_INFO } = require('../../utils/api_resources');

test('Ensure all cards have an in-stock QOH if getting in-stock', async () => {
    const CARD_TITLE = "Birds of Paradise";

    const firstInventory = await axios.get(GET_CARDS_WITH_INFO, {
        params: { title: CARD_TITLE, matchInStock: true }
    })

    for (let card of firstInventory.data) {
        let count = 0;

        for (let [key, value] of Object.entries(card.qoh)) { // Add up all quantities in the qoh object
            count += value;
        }

        expect(count).toBeGreaterThan(0);
    }
})