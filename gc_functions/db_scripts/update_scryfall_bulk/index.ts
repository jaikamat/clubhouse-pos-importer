import yargs from "yargs";
import aggregateValidCards from "./aggregateValidCards";
import collectionUpkeep from "./collectionUpkeep";
import mongoBulkImport from "./mongoBulkImport";
import saveScryfallBulk from "./saveScryfallBulk";
const SOURCE_JSON_URI = `${__dirname}/bulk_data/bulk_all_cards.json`;

const argv = yargs
    .option({
        database: {
            alias: "database",
            choices: ["test", "clubhouse_collection_production"] as const,
            demandOption: true,
            description: "database to use",
        },
    })
    .parseSync();

async function init() {
    const { database } = argv;

    if (!database) throw new Error("Mongo database name is required");

    try {
        console.time("bulkUpdate");

        // Save all_cards locally
        console.log("Fetching Scryfall bulk...");
        await saveScryfallBulk("all_cards");
        console.log("Scryfall bulk downloaded and written");

        // Clean collections and rebuilt indexes if required
        console.log("Deleting collection documents...");
        await collectionUpkeep(database);
        console.log("Documents deleted, collection is clean");

        // Aggregate valid cards
        console.log("Aggregating cards...");
        const source = await aggregateValidCards(SOURCE_JSON_URI);

        // Persist the aggregated cards
        console.log(`Updating bulk for ${source.length} cards...`);
        await mongoBulkImport(source, database);

        console.timeEnd("bulkUpdate");
        console.log(
            `Bulk cards updated for database ${database} on ${new Date().toISOString()}`
        );
    } catch (err) {
        throw err;
    }
}

init().catch(console.log);
