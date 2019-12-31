const csv = require('csvtojson');
const csvPath = './csv_data/Inventory_TheClubhouse_2019.December.11.csv';
const scryfallData = require('./scryfall_data/scryfall-default-cards.json.js');
const fs = require('fs');

// Strip out altered arts and manually import them
// All other cards can be matched on foil status, set name, and card name

async function createJson() {
    const clubhouseData = await csv().fromFile(csvPath);
    const output = [];

    for (let i = 0; i < clubhouseData.length; i++) {
        const card = clubhouseData[i];

        for (let j = 0; j < scryfallData.length; j++) {
            const scryCard = scryfallData[j];

            if (
                // If the card name and set name match
                // TODO: Need to skip Eldraine (ELD)
                // TODO: Need to skip alternate arts
                // Need to collect the skipped cards in a separate output for study
                card.Name === scryCard.name &&
                card.Edition === scryCard.set_name &&
                card.Edtion !== 'Throne of Eldraine' &&
                card['Altered Art'] === ''
            ) {
                const qty = parseInt(card.Count);
                card.Foil
                    ? (scryCard.qoh = { FOIL_NM: qty })
                    : (scryCard.qoh = { NONFOIL_NM: qty });

                output.push(scryCard);
                break;
            }
        }

        console.log(`index: ${i} | match count: ${output.length}`);
    }

    fs.writeFileSync(`./output/output.json`, JSON.stringify(output, null, ' '));
    console.log(`File written!`);
}

(() => {
    createJson();
})();
