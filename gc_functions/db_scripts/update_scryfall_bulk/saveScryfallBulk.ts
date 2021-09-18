import axios from "axios";
import fs from "fs";
import path from "path";

/**
 * Retrieves and saves a Scryfall bulk file
 * @param {String} bulkType - the type of bulk JSON used in Scryfall
 */
async function saveScryfallBulk(bulkType) {
    try {
        // Create the bulk data folder, if it doesn't exist
        const bulkDataFolder = path.resolve(__dirname, "bulk_data");

        if (!fs.existsSync(bulkDataFolder)) {
            fs.mkdirSync(bulkDataFolder);
        }

        const bulkUri = "https://api.scryfall.com/bulk-data";

        const { data } = await axios.get(bulkUri);
        const defaultCardsUri = data.data.find(
            (d) => d.type === bulkType
        ).download_uri;

        const myPath = path.resolve(
            __dirname,
            "bulk_data",
            `bulk_${bulkType}.json`
        );
        const writer = fs.createWriteStream(myPath);

        console.log("Fetching Scryfall bulk...");

        const response = await axios({
            url: defaultCardsUri,
            method: "GET",
            responseType: "stream",
        });

        response.data.pipe(writer);

        return new Promise<void>((resolve, reject) => {
            writer.on("finish", () => {
                console.log("Scryfall bulk downloaded and written");
                resolve();
            });

            writer.on("error", reject);
        });
    } catch (err) {
        throw err;
    }
}

export default saveScryfallBulk;
