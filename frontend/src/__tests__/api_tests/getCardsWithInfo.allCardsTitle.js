process.env.REACT_APP_ENVIRONMENT = 'development';

import axios from 'axios';
const { GET_CARDS_WITH_INFO } = require('../../utils/api_resources');

test('Ensure all cards have the proper title', async () => {
    const CARD_TITLE = "Birds of Paradise";

    const firstInventory = await axios.get(GET_CARDS_WITH_INFO, {
        params: { title: CARD_TITLE, matchInStock: false }
    })

    for (let card of firstInventory.data) {
        expect(card.name).toBe(CARD_TITLE);
    }
})