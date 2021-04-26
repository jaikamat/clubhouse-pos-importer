require('dotenv').config({ path: './src/__tests__/api_tests/.env' }); // Relative pathname from the point of injection at runtime, not directory structure
import axios from 'axios';
const { RECEIVE_CARDS, GET_CARDS_WITH_INFO, LOGIN } = require('../../utils/api_resources');

describe('Receiving endpoint', () => {
    const TIMEOUT = 10000;
    let originalQuantities = [];
    let authToken; '';

    // Get data on card 'Voracious Greatshark'
    beforeAll(async () => {
        const { data } = await axios.get(GET_CARDS_WITH_INFO, {
            params: { title: 'Voracious Greatshark' }
        })

        originalQuantities = data.map(({ id, name, set_name, set, qoh }) => ({ id, name, set_name, set, qoh }));
    })

    // Log in to receive the JWT
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

    test('Persist received cards', async () => {
        const cardsToCommit = [];

        // Unwind on qoh properties (finishCondition) to individual entries
        originalQuantities.forEach(c => {
            for (let finishCondition in c.qoh) {
                cardsToCommit.push({ ...c, finishCondition, quantity: 1 })
            }
        })

        // Get back the document insertion/modification confirmations from Mongo
        const { data } = await axios.post(RECEIVE_CARDS, {
            cards: cardsToCommit
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        expect(data.length).toBe(cardsToCommit.length);
    }, TIMEOUT)

    test('Get new cards and compare to originl', async () => {
        const { data } = await axios.get(GET_CARDS_WITH_INFO, {
            params: { title: 'Voracious Greatshark' }
        })

        const newData = [];
        const oldData = [];

        // Unwind new cards on qoh
        data.forEach(({ id, name, set_name, set, qoh }) => {
            for (let finishCondition in qoh) {
                newData.push({ id, name, set_name, set, qoh: qoh[finishCondition], finishCondition })
            }
        })

        // Unwind old cards on qoh
        originalQuantities.forEach(({ id, name, set_name, set, qoh }) => {
            for (let finishCondition in qoh) {
                oldData.push({ id, name, set_name, set, qoh: qoh[finishCondition], finishCondition })
            }
        })

        // Confirm the new quantities are incremented by 1
        oldData.forEach((q, idx) => {
            const oldQty = q.qoh;
            const newQty = newData[idx].qoh // We are guaranteed to receive the data in the same order from getCardsWithInfo
            expect(oldQty + 1).toBe(newQty);
        })
    })
})