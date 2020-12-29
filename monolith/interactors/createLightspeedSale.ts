import axios from 'axios';
import { ClubhouseLocation } from './getJwt';

/**
 * Helper fn used to create employee-readable note lines in the Lightspeed POS system
 * @param {Object} card - the card involved in the transaction
 */
function createSaleLine(card) {
    const { price, qtyToSell, finishCondition, name, set_name } = card;

    return `${name} | ${set_name} | Qty sold: ${qtyToSell} | Condition: ${finishCondition} | Price/unit: ${price}`;
}

/**
 * Yields location-specific LightSpeed API values for making sales
 *
 * Retro is the shop; Lance separates by register
 * Register ID designates The Clubhouse
 */
function registerInfoFromLocation(location: ClubhouseLocation) {
    if (location === 'ch1') {
        return {
            shopId: 1,
            registerId: 2,
            employeeId: 1,
        };
    }
    if (location === 'ch2') {
        return {
            shopId: 16,
            registerId: 19,
            employeeId: 1,
        };
    }
}

/**
 * Creates a sale via the Lightspeed API
 *
 * @param {String} authToken - the store's OAuth access token
 * @param {Array} cards - array of cards involved in the sale
 */
async function createLightspeedSale(
    authToken,
    cards,
    location: ClubhouseLocation
) {
    const { shopId, registerId, employeeId } = registerInfoFromLocation(
        location
    );

    try {
        const url = `https://api.lightspeedapp.com/API/Account/${process.env.LIGHTSPEED_ACCT_ID}/Sale.json`;

        const config = {
            headers: { Authorization: `Bearer ${authToken}` },
        };

        const saleLines = cards.map((card) => {
            return {
                Note: { note: createSaleLine(card) },
                taxClassID: 0,
                unitPrice: card.price,
                avgCost: 0,
                fifoCost: 0,
                unitQuantity: card.qtyToSell,
            };
        });

        const bodyParameters = {
            completed: false,
            taxCategoryID: 0,
            employeeID: employeeId,
            shopID: shopId,
            registerID: registerId,
            SaleLines: {
                SaleLine: saleLines,
            },
        };

        console.log(`Creating Lightspeed sale at ${location}`);

        return await axios.post(url, bodyParameters, config);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export default createLightspeedSale;
