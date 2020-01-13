const formattedOutputData = require('./output/matched_ids.json');
const fs = require('fs');
const _ = require('lodash');

async function createJson() {
    const groupedData = _.groupBy(formattedOutputData, '_id');
    const final_output = [];

    for (let p in groupedData) {
        const cardArray = groupedData[p];

        if (cardArray.length === 2) { // Check for 2
            const card1qoh = cardArray[0].qoh;
            const card2qoh = cardArray[1].qoh;

            const newQoh = _.assign({}, card1qoh, card2qoh);

            const card = cardArray[0];
            card.qoh = newQoh;

            final_output.push(card);
        } else {
            final_output.push(groupedData[p][0]);
        }
    }

    console.log(final_output.length);

    fs.writeFileSync(
        `./output/final_output.json`,
        JSON.stringify(final_output, null, ' ')
    );

    console.log(`finished`);
}

(() => {
    createJson();
})();
