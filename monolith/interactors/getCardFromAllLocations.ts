import { Db, MongoClient } from 'mongodb';
import collectionFromLocation from '../lib/collectionFromLocation';
import getDatabaseName from '../lib/getDatabaseName';
import parseQoh from '../lib/parseQoh';
import { ClubhouseLocation } from './getJwt';
const DATABASE_NAME = getDatabaseName();

async function getSingleLocationCard(
    title: string,
    db: Db,
    location: ClubhouseLocation
) {
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
    // if matchInStock is false, we get all cards, even those with no stock
    const mongoConfig = { useNewUrlParser: true, useUnifiedTopology: true };

    try {
        var client = await new MongoClient(
            process.env.MONGO_URI,
            mongoConfig
        ).connect();

        const db = client.db(DATABASE_NAME);

        const ch1 = await getSingleLocationCard(title, db, 'ch1');
        const ch2 = await getSingleLocationCard(title, db, 'ch2');

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
    } finally {
        await client.close();
    }
}

export default getCardFromAllLocations;
