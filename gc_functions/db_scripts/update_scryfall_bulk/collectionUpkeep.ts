require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const COLLECTION = "scryfall_bulk_cards";

async function collectionUpkeep(databaseName: string) {
    const mongoSettings = { useNewUrlParser: true, useUnifiedTopology: true };

    try {
        const { MONGO_URI } = process.env;
        var client = await MongoClient.connect(MONGO_URI, mongoSettings);
        const db = await client.db(databaseName || "test");

        console.log(`Connected to MongoDB database: ${db.databaseName}`);

        // Recreate desired collection indexes
        console.log("Recreating collection indexes...");
        await db
            .collection(COLLECTION)
            .createIndexes([
                { key: { id: 1 } },
                { key: { name: 1, games: 1 } },
                { key: { name: 1 } },
            ]);
        console.log("Collection indexes recreated");

        // Delete all elements in the collection
        console.log("Deleting collection documents...");
        await db.collection(COLLECTION).deleteMany({});
        console.log("Documents deleted, preparing to insert fresh cards");
    } catch (error) {
        throw error;
    } finally {
        await client.close();
        console.log("Disconnected from MongoDB");
    }
}

export default collectionUpkeep;
