import { ClubhouseLocation } from '../common/types';
import getDatabaseConnection from '../database';
import collectionFromLocation from '../lib/collectionFromLocation';

async function getCardQuantitiesFromInventory(
    scryfallIds: string[],
    location: ClubhouseLocation
) {
    try {
        const db = await getDatabaseConnection();
        const collection = db.collection(
            collectionFromLocation(location).cardInventory
        );

        const data = await collection.find(
            {
                _id: { $in: scryfallIds },
            },
            {
                projection: {
                    _id: true,
                    qoh: true,
                },
            }
        );

        const documents = await data.toArray();

        const res = {};

        documents.forEach((d) => (res[d._id] = d.qoh));

        return res;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export default getCardQuantitiesFromInventory;
