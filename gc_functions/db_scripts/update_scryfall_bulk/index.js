const argv = require("yargs").argv;
const saveScryfallBulk = require("./saveScryfallBulk");
const mongoBulkImport = require("./mongoBulkImport");
const getLanguageCards = require("./getLanguageCards");
const SOURCE_JSON_URI = `${__dirname}/bulk_data/bulk_all_cards.json`;

async function init() {
    const { database } = argv;

    if (!database) throw new Error("Mongo database name is required");

    try {
        console.time("bulkUpdate");

        await saveScryfallBulk("all_cards"); // Save all_cards to the machine

        console.log("Collating English cards...");
        const sourceEnglish = await getLanguageCards(SOURCE_JSON_URI, "en"); // Grab all English cards
        console.log(`Updating bulk for ${sourceEnglish.length} cards...`);
        await mongoBulkImport(sourceEnglish, database); // Persist them

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
