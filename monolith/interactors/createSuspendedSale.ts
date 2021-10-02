import moment from 'moment';
import RawScryfallCard from '../common/RawScryfallCard';
import { ScryfallApiCard } from '../common/ScryfallApiCard';
import { ClubhouseLocation, Collection, FinishSaleCard } from '../common/types';
import getDatabaseConnection from '../database';
import collectionFromLocation from '../lib/collectionFromLocation';
import updateCardInventory from './updateCardInventory';

/**
 * Validates a card's quantity-to-sell against available inventory
 * @param {object} saleListCard properties - the card sent from the frontend with relevant qtyToSell, finishCondition, and id properties attached
 */
async function validateInventory(
    saleCard: FinishSaleCard,
    location: ClubhouseLocation
) {
    try {
        const { qtyToSell, finishCondition, name, id } = saleCard;
        const db = await getDatabaseConnection();
        const collection = db.collection(
            collectionFromLocation(location).cardInventory
        );

        const doc = await collection.findOne({ _id: id });

        const quantityOnHand = doc.qoh[finishCondition];

        if (qtyToSell > quantityOnHand) {
            throw new Error(
                `${name}'s QOH of ${qtyToSell} exceeds inventory of ${quantityOnHand}`
            );
        }

        return true;
    } catch (e) {
        throw e;
    }
}

/**
 * Finds a bulk card by its associated `_id`
 */
async function findBulkById(id: string): Promise<RawScryfallCard> {
    try {
        const db = await getDatabaseConnection();

        const card: RawScryfallCard = await db
            .collection(Collection.scryfallBulkCards)
            .findOne({ _id: id });

        return card;
    } catch (err) {
        throw err;
    }
}

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
            async (card) => await validateInventory(card, location)
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
