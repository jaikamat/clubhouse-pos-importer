import { ClubhouseLocation, Collection } from '../common/types';
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
                $or: [
                    /**
                     * Some cards with _no_ `games` array, we want to include
                     *
                     * ex. World Championship cards, and freshly-added cards are in this list
                     */
                    {
                        'games.0': {
                            $exists: false,
                        },
                    },
                    /**
                     * We also want to include cards that, if they _do_ have a `games` array,
                     * include "paper" as a game type
                     */
                    {
                        games: {
                            $in: ['paper'],
                        },
                    },
                ],
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
                    { 'qoh.ETCHED_NM': { $gt: 0 } },
                    { 'qoh.ETCHED_LP': { $gt: 0 } },
                    { 'qoh.ETCHED_MP': { $gt: 0 } },
                    { 'qoh.ETCHED_HP': { $gt: 0 } },
                ],
            },
        };

        pipeline.push(match);
        pipeline.push(lookup);
        pipeline.push(addFields);
        if (matchInStock) pipeline.push(inventoryMatch);

        return await db
            .collection(Collection.scryfallBulkCards)
            .aggregate(pipeline)
            .toArray();
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export default getCardsWithInfo;
