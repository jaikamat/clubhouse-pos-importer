import { ClubhouseLocation } from '../common/types';
import getDatabaseConnection from '../database';
import collectionFromLocation from '../lib/collectionFromLocation';

async function getSalesFromCardname(cardName, location: ClubhouseLocation) {
    try {
        const db = await getDatabaseConnection();

        // Returns only the relevant queried cards from the card_list array of cards involved in the sale
        // Refer to https://blog.fullstacktraining.com/retrieve-only-queried-element-in-an-object-array-in-mongodb-collection/
        const data = await db
            .collection(collectionFromLocation(location).salesData)
            .aggregate([
                { $match: { 'card_list.name': cardName } },
                {
                    $project: {
                        card_list: {
                            $filter: {
                                input: '$card_list',
                                as: 'card_list',
                                cond: { $eq: ['$$card_list.name', cardName] },
                            },
                        },
                        sale_data: 1,
                    },
                },
            ]);

        return await data.toArray();
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export default getSalesFromCardname;
