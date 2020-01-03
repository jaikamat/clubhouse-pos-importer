const csv = require('csvtojson');
const csvPath = './csv_data/Inventory_TheClubhouse_2019.December.11.csv';
const scryfallData = require('./scryfall_data/scryfall-default-cards.json');
const fs = require('fs');
const _ = require('lodash');

/**
 * This takes in a CSV deckbox file and yields:
 * Matched cards as Scryfall objects to be imported to Mongo
 * Not Matched cards to be manually added
 * Skipped cards to be manuall added
 */
async function createJson() {
    const clubhouseData = await csv().fromFile(csvPath);
    const matched = [];
    const skipped = [];
    const notMatched = [];

    for (let i = 0; i < clubhouseData.length; i++) {
        const card = clubhouseData[i];
        let matchFlag = false;

        // Remove Altered Art cards from consideration
        if (card['Altered Art'] !== '') {
            skipped.push(card);
            continue;
        }

        for (let j = 0; j < scryfallData.length; j++) {
            const scryCard = scryfallData[j];

            // Mutate certain sets to conform to scryfall's set names before comparison
            if (card.Edition === 'Modern Masters 2015 Edition') {
                card.Edition = 'Modern Masters 2015';
            }
            if (card.Edition === 'Modern Masters 2017 Edition') {
                card.Edition = 'Modern Masters 2017';
            }
            if (card.Edition === 'Magic 2015 Core Set') {
                card.Edition = 'Magic 2015';
            }
            if (card.Edition === 'Magic 2014 Core Set') {
                card.Edition = 'Magic 2014';
            }

            // Make set and card name checks
            if (
                card.Name === scryCard.name &&
                card.Edition === scryCard.set_name
            ) {
                const quantity = parseInt(card.Count);

                card.Foil
                    ? (scryCard.qoh = { FOIL_NM: quantity })
                    : (scryCard.qoh = { NONFOIL_NM: quantity });

                matched.push(scryCard);
                matchFlag = true;
                break;
            }
        }

        if (!matchFlag) {
            notMatched.push({ set_name: card.Edition, card_name: card.Name });
        }

        console.log(`index: ${i} | match count: ${matched.length}`);
    }

    console.log('Matched ', matched.length);
    console.log('Skipped ', skipped.length);
    console.log('Not Matched ', notMatched.length);

    fs.writeFileSync(
        `./output/matched.json`,
        JSON.stringify(matched, null, ' ')
    );

    fs.writeFileSync(
        `./output/skipped.json`,
        JSON.stringify(_.uniq(skipped), null, ' ')
    );

    fs.writeFileSync(
        `./output/notMatched.json`,
        JSON.stringify(_.uniq(notMatched), null, ' ')
    );

    console.log(`Files written!`);
}

(() => {
    createJson();
})();
