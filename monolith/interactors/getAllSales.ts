import { MongoClient } from 'mongodb';
import collectionFromLocation from '../lib/collectionFromLocation';
import getDatabaseName from '../lib/getDatabaseName';
import mongoOptions from '../lib/mongoOptions';
const DATABASE_NAME = getDatabaseName();
import { ClubhouseLocation } from './getJwt';

async function getAllSales(location: ClubhouseLocation) {
    const client = await new MongoClient(process.env.MONGO_URI, mongoOptions);

    try {
        await client.connect();
        const db = client.db(DATABASE_NAME);

        const data = await db
            .collection(collectionFromLocation(location).salesData)
            .find({})
            .project({
                sale_data: 1,
                'sale_data.total': 1,
                'sale_data.saleID': 1,
                'sale_data.timeStamp': 1,
                card_list: 1,
                'card_list.foil': 1,
                'card_list.nonfoil': 1,
                'card_list.id': 1,
                'card_list.name': 1,
                'card_list.set': 1,
                'card_list.set_name': 1,
                'card_list.rarity': 1,
                'card_list.price': 1,
                'card_list.finishCondition': 1,
                'card_list.reserved': 1,
                'card_list.qtyToSell': 1,
                'card_list.card_faces': 1,
            });

        const docs = await data.toArray();

        // Some data, like 'total' and 'price' should be coerced to a Number for ease of use on the frontend
        docs.forEach((el) => {
            el.sale_data.total = Number(el.sale_data.total);

            el.card_list.forEach((el, idx, arr) => {
                arr[idx].price = Number(arr[idx].price);
            });
        });

        return docs;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await client.close();
    }
}

export default getAllSales;
