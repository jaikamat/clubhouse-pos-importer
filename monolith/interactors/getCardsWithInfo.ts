import { ClubhouseLocation } from '../common/types';
import getDatabaseConnection from '../database';
import collectionFromLocation from '../lib/collectionFromLocation';

async function getCardsWithInfo(
    title: string,
    // if matchInStock is false, we get all cards, even those with no stock
    matchInStock: boolean = false,
    location: ClubhouseLocation
) {
    try {
        const db = await getDatabaseConnection();

        const pipeline = [];

        // Fetch by title
        const match = {
            $match: {
                name: title,
                games: {
                    $in: ['paper'],
                },
            },
        };

        // Zip up bulk with qoh
        const lookup = {
            $lookup: {
                from: collectionFromLocation(location).cardInventory,
                localField: 'id',
                foreignField: '_id',
                as: 'qoh',
            },
        };

        // $lookup yields an array - replace the new qoh with the nested card value
        const addFields = {
            $addFields: {
                qoh: { $arrayElemAt: ['$qoh.qoh', 0] },
            },
        };

        // Only yield cards that are in-stock, if needed
        const inventoryMatch = {
            $match: {
                $or: [
                    { 'qoh.FOIL_NM': { $gt: 0 } },
                    { 'qoh.FOIL_LP': { $gt: 0 } },
                    { 'qoh.FOIL_MP': { $gt: 0 } },
                    { 'qoh.FOIL_HP': { $gt: 0 } },
                    { 'qoh.NONFOIL_NM': { $gt: 0 } },
                    { 'qoh.NONFOIL_LP': { $gt: 0 } },
                    { 'qoh.NONFOIL_MP': { $gt: 0 } },
                    { 'qoh.NONFOIL_HP': { $gt: 0 } },
                ],
            },
        };

        pipeline.push(match);
        pipeline.push(lookup);
        pipeline.push(addFields);
        if (matchInStock) pipeline.push(inventoryMatch);

        return await db
            .collection('scryfall_bulk_cards')
            .aggregate(pipeline)
            .toArray();
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export default getCardsWithInfo;
