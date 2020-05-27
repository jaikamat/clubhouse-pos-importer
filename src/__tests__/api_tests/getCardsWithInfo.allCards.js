process.env.REACT_APP_ENVIRONMENT = 'development';

import axios from 'axios';
const { GET_CARDS_WITH_INFO } = require('../../utils/api_resources');

test('Get all cards, including those with zero stock', async () => {
    const CARD_TITLE = "Yawgmoth's Will";

    const firstInventory = await axios.get(GET_CARDS_WITH_INFO, {
        params: { title: CARD_TITLE, matchInStock: false }
    })

    expect(firstInventory.data.length).toBe(2);
})