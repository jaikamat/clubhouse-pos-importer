import yargs from "yargs";
import collectionUpkeep from "./collectionUpkeep";
import getLanguageCards from "./getLanguageCards";
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

        await saveScryfallBulk("all_cards"); // Save all_cards locally

        await collectionUpkeep(database); // Maintain indexes and clear documents

        // Add English cards
        console.log("Collating English cards...");
        const sourceEnglish = await getLanguageCards(SOURCE_JSON_URI, "en"); // Grab all English cards
        console.log(`Updating bulk for ${sourceEnglish.length} cards...`);
        await mongoBulkImport(sourceEnglish, database); // Persist them

        // Add Japanese cards
        console.log("Collating Japanese cards...");
        const sourceJapanese = await getLanguageCards(SOURCE_JSON_URI, "ja"); // Grab all Japanese cards
        console.log(`Updating bulk for ${sourceJapanese.length} cards...`);
        await mongoBulkImport(sourceJapanese, database); // Persist them

        console.timeEnd("bulkUpdate");
        console.log(
            `Bulk cards updated for database ${database} on ${new Date().toISOString()}`
        );
    } catch (err) {
        throw err;
    }
}

init().catch(console.log);
