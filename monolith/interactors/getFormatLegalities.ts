import getDatabaseConnection from '../database';
import { ClubhouseLocation, Collection } from '../common/types';
import collectionFromLocation from '../lib/collectionFromLocation';

async function getFormatLegalities(location: ClubhouseLocation) {
    try {
        const db = await getDatabaseConnection();

        const agg = []; // Build the aggregation

        // Group by card_list and add the card_list value
        agg.push({
            $group: {
                _id: 0,
                card_list: { $push: '$card_list' },
            },
        });

        // Reduce the card_list group to a new array value by concatenating
        agg.push({
            $project: {
                cards_sold: {
                    $reduce: {
                        input: '$card_list',
                        initialValue: [],
                        in: { $concatArrays: ['$$value', '$$this'] },
                    },
                },
            },
        });

        // Create a new document for each array element in the card_list
        agg.push({
            $unwind: '$cards_sold',
        });

        // Project new fields from the embedded objects within card_list
        agg.push({
            $project: {
                _id: 0,
                id: '$cards_sold._id',
                name: '$cards_sold.name',
                qtyToSell: '$cards_sold.qtyToSell',
                finishCondition: '$cards_sold.finishCondition',
                price: '$cards_sold.price',
            },
        });

        // Create a join on the card ID to get current format legality
        agg.push({
            $lookup: {
                from: Collection.scryfallBulkCards,
                localField: 'id',
                foreignField: 'id',
                as: 'joined_card',
            },
        });

        // Finally, project new fields by adding format_legality and pulling from the $lookup array
        agg.push({
            $project: {
                _id: 0,
                id: 1,
                name: 1,
                qtyToSell: 1,
                finishCondition: 1,
                price: 1,
                legalities: { $arrayElemAt: ['$joined_card.legalities', 0] },
            },
        });

        const data = await db
            .collection(collectionFromLocation(location).salesData)
            .aggregate(agg)
            .toArray();

        data.forEach((el) => {
            el.qtyToSell = parseInt(el.qtyToSell);
        });

        return data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export default getFormatLegalities;
