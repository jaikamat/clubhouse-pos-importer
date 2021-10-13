import moment from 'moment';
import { ScryfallApiCard } from '../common/ScryfallApiCard';
import { ClubhouseLocation, FinishSaleCard } from '../common/types';
import getDatabaseConnection from '../database';
import collectionFromLocation from '../lib/collectionFromLocation';
import findBulkById from './findBulkById';
import isValidInventory from './isValidInventory';
import updateCardInventory from './updateCardInventory';

/**
 * // TODO: Is this true??
 * Creates a suspended sale. Note that the DB has a TTL index on `createdAt` that wipes documents more than one week old
 * @param {string} customerName - Name of the customer
 * @param {string} notes - Optional notes
 * @param {array} saleList - The array of card objects used on the frontend - translated directly from React state
 */
async function createSuspendedSale(
    customerName: string,
    notes: string | null,
    saleList: FinishSaleCard[],
    location: ClubhouseLocation
) {
    try {
        const db = await getDatabaseConnection();
        const collection = db.collection(
            collectionFromLocation(location).suspendedSales
        );

        console.log(`Creating new suspended sale at ${location}`);

        // Validate inventory prior to transacting
        const validations = saleList.map(
            async (card) => await isValidInventory(card, location)
        );
        await Promise.all(validations);

        // Removes the passed cards from inventory prior to creating
        const dbInserts = saleList.map(
            async (card) =>
                await updateCardInventory(
                    { ...card, qtyToSell: -Math.abs(card.qtyToSell) },
                    location
                )
        );
        await Promise.all(dbInserts);

        // Aggregate bulk of all the target cards
        const promisedCards = saleList.map((card) => findBulkById(card.id));
        const bulkCards = await Promise.all(promisedCards);

        // Zip them up with the received sale metadata
        const transformedCards = bulkCards.map((bc, idx) => {
            const currentSaleListCard = saleList[idx];
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

        return await collection.insertOne({
            createdAt: moment().utc().toDate(),
            name: customerName,
            notes: notes,
            list: transformedCards,
        });
    } catch (e) {
        throw e;
    }
}

export default createSuspendedSale;
