import { MongoClient } from 'mongodb';
import collectionFromLocation from '../lib/collectionFromLocation';
import getDatabaseName from '../lib/getDatabaseName';
import mongoOptions from '../lib/mongoOptions';
import { ClubhouseLocation } from './getJwt';
const DATABASE_NAME = getDatabaseName();

async function getSalesFromCardname(cardName, location: ClubhouseLocation) {
    const client = await new MongoClient(process.env.MONGO_URI, mongoOptions);

    try {
        await client.connect();

        const db = client.db(DATABASE_NAME);

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
    } finally {
        await client.close();
    }
}

export default getSalesFromCardname;
