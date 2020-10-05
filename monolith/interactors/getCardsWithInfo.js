const MongoClient = require('mongodb').MongoClient;
const DATABASE_NAME = 'test';

async function getCardsWithInfo(title, matchInStock = false) {
    // if matchInStock is false, we get all cards, even those with no stock
    const mongoConfig = { useNewUrlParser: true, useUnifiedTopology: true };

    try {
        var client = await new MongoClient(
            process.env.MONGO_URI,
            mongoConfig
        ).connect();
        console.log('Successfully connected to mongo');

        const db = client.db(DATABASE_NAME);

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
                from: 'card_inventory',
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
        return err;
    } finally {
        await client.close();
        console.log('Disconnected from mongo');
    }
}

module.exports = getCardsWithInfo;
