const matched = require('./output/matched.json');
const fs = require('fs');

/**
 * This creates an _id field on each card for mongoimport to upsert,
 * so we are using Scryfall's UUID's rather than mongo-generated ones.
 *
 * TODO: Maybe should pull this into the main migration script,
 * but separating it here for clarity of process.
 */
const newIds = matched.map(m => {
    m._id = m.id;
    return m;
});

fs.writeFileSync(
    './output/matched_ids.json',
    JSON.stringify(newIds, null, ' ')
);
