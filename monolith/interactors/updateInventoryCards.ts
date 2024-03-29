import request from 'request-promise-native';
import { ScryfallApiCard } from '../common/ScryfallApiCard';
import { ClubhouseLocation, FinishSaleCard } from '../common/types';
import getDatabaseConnection from '../database';
import collectionFromLocation from '../lib/collectionFromLocation';
import createLightspeedSale from './createLightspeedSale';
import findBulkById from './findBulkById';

/**
 * Updates a single card's QOH based on qtyToSell, finishCondition, id, name
 *
 * @param {Object} card - the card involved in the transaction
 */
async function updateCardInventory(
    database,
    card: FinishSaleCard,
    location: ClubhouseLocation
) {
    const { qtyToSell, finishCondition, id, name } = card;

    try {
        console.log(
            `Update: QTY: ${qtyToSell}, ${finishCondition}, ${name}, ${id}, LOCATION: ${location}`
        );

        // Upsert the new qtyToSell in the document
        await database
            .collection(collectionFromLocation(location).cardInventory)
            .findOneAndUpdate(
                { _id: id },
                {
                    $inc: {
                        [`qoh.${finishCondition}`]: -Math.abs(qtyToSell),
                    },
                },
                {
                    projection: {
                        _id: true,
                        qoh: true,
                        name: true,
                        setName: true,
                        set: true,
                    },
                    returnOriginal: false,
                }
            );

        // Validate inventory quantites to never be negative numbers
        await database
            .collection(collectionFromLocation(location).cardInventory)
            .updateOne(
                {
                    _id: id,
                    [`qoh.${finishCondition}`]: { $lt: 0 },
                },
                { $set: { [`qoh.${finishCondition}`]: 0 } }
            );

        // Get the updated document for return
        return await database
            .collection(collectionFromLocation(location).cardInventory)
            .findOne(
                { _id: id },
                {
                    projection: {
                        _id: true,
                        qoh: true,
                        name: true,
                        setName: true,
                        set: true,
                    },
                }
            );
    } catch (err) {
        console.log(err);
        throw err;
    }
}

/**
 * Exposes the DB and passes it down to child queries; wraps the promises
 */
export async function updateInventoryCards(
    cards: FinishSaleCard[],
    location: ClubhouseLocation
) {
    try {
        const db = await getDatabaseConnection();
        const dbInserts = cards.map((card) =>
            updateCardInventory(db, card, location)
        );

        return await Promise.all(dbInserts); // Persist the inventory changes
    } catch (err) {
        console.log(err);
        throw err;
    }
}

/**
 * Creates a sale persisted to Mongo
 *
 * @param saleData - the data returned by Lightspeed when creating a sale
 * @param cardList - an array of cards that were involved in the sale
 */
async function createSale(
    saleData,
    cardList: FinishSaleCard[],
    location: ClubhouseLocation
) {
    try {
        const db = await getDatabaseConnection();

        // Aggregate bulk of all the target cards
        const promisedCards = cardList.map((card) => findBulkById(card.id));
        const bulkCards = await Promise.all(promisedCards);

        // Zip the bulk up with the sale list metadata
        const transformedCards = bulkCards.map((bc, idx) => {
            const currentSaleListCard = cardList[idx];

            const { price, qtyToSell, finishCondition, name, set_name } =
                currentSaleListCard;

            return {
                ...new ScryfallApiCard(bc),
                price,
                qtyToSell,
                finishCondition,
                name,
                set_name,
            };
        });

        return await db
            .collection(collectionFromLocation(location).salesData)
            .insertOne({
                sale_data: saleData,
                card_list: transformedCards,
            });
    } catch (err) {
        console.log(err);
        throw err;
    }
}

/**
 * Main function that wraps the execution
 * @param {Array} cards - the cards involved in the transaction
 */
async function finishSale(
    cards: FinishSaleCard[],
    location: ClubhouseLocation,
    lightspeedEmployeeNumber: number
) {
    try {
        const res = await request.post({
            url: 'https://cloud.lightspeedapp.com/oauth/access_token.php',
            form: {
                grant_type: process.env.GRANT_TYPE,
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                refresh_token: process.env.REFRESH_TOKEN,
            },
        });

        // Grab the Lightspeed access token from response
        const { access_token } = JSON.parse(res);

        // Create the Lightspeed sale
        const { data } = await createLightspeedSale(
            access_token,
            cards,
            location,
            lightspeedEmployeeNumber
        );

        // Map updated inserts after successful Lightspeed sale creation
        const dbRes = await updateInventoryCards(cards, location);

        // Create and persist sale data
        await createSale(data.Sale, cards, location);

        return {
            cards_upserted: dbRes,
            sale_data: data,
        };
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export default finishSale;
