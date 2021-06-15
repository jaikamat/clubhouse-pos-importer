import { ClubhouseLocation } from '../common/types';
import getDatabaseConnection from '../database';
import collectionFromLocation from '../lib/collectionFromLocation';
import parseQoh from '../lib/parseQoh';

async function getSingleLocationCard(
    title: string,
    location: ClubhouseLocation
) {
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

    const project = {
        $project: {
            qoh: 1,
            name: 1,
        },
    };

    pipeline.push(match);
    pipeline.push(lookup);
    pipeline.push(addFields);
    pipeline.push(inventoryMatch);
    pipeline.push(project);

    return await db
        .collection('scryfall_bulk_cards')
        .aggregate(pipeline)
        .toArray();
}

async function getCardFromAllLocations(title: string) {
    try {
        const ch1 = await getSingleLocationCard(title, 'ch1');
        const ch2 = await getSingleLocationCard(title, 'ch2');

        // Add up the [foil, nonfoil] quantities of each card's QOH
        const ch1Combined = ch1.reduce(
            (acc, c) => {
                const { foilQty, nonfoilQty } = parseQoh(c.qoh);
                return {
                    foilQty: acc.foilQty + foilQty,
                    nonfoilQty: acc.nonfoilQty + nonfoilQty,
                };
            },
            { foilQty: 0, nonfoilQty: 0 }
        );

        const ch2Combined = ch2.reduce(
            (acc, c) => {
                const { foilQty, nonfoilQty } = parseQoh(c.qoh);
                return {
                    foilQty: acc.foilQty + foilQty,
                    nonfoilQty: acc.nonfoilQty + nonfoilQty,
                };
            },
            { foilQty: 0, nonfoilQty: 0 }
        );

        return {
            ch1: ch1Combined,
            ch2: ch2Combined,
        };
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export default getCardFromAllLocations;
