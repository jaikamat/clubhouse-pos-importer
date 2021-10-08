import { ClubhouseLocation, FinishSaleCard } from '../common/types';
import getDatabaseConnection from '../database';
import collectionFromLocation from '../lib/collectionFromLocation';

/**
 * Validates a card's quantity-to-sell against available inventory during a sale or sale-suspension
 */
async function isValidInventory(
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
                `${name}'s quantity of ${qtyToSell} exceeds available inventory of ${quantityOnHand}`
            );
        }

        return true;
    } catch (e) {
        throw e;
    }
}

export default isValidInventory;
