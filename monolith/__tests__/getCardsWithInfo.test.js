const { ExpectationFailed } = require('http-errors');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
// TODO: We currently require in the built code. We should be requiring the TS file,
// but this will require some finagling with tooling configs
const {
    default: getCardsWithInfo,
} = require('../built/interactors/getCardsWithInfo');
const {
    default: addCardToInventory,
} = require('../built/interactors/addCardToInventory');

let mongoServer;
let client;
const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const PROD_DB = 'clubhouse_collection_production';
const SCRYFALL_BULK = 'scryfall_bulk_cards';
const bulkCard = {
    object: 'card',
    id: 'f3d62dbd-63db-4ac9-950f-9852627f23f2',
    oracle_id: 'cac55e46-b730-4569-b92c-a4b5922fc20c',
    multiverse_ids: [10423],
    mtgo_id: 12385,
    mtgo_foil_id: 12386,
    tcgplayer_id: 7070,
    cardmarket_id: 10310,
    name: 'Time Spiral',
    lang: 'en',
    released_at: '1998-10-12',
    uri: 'https://api.scryfall.com/cards/f3d62dbd-63db-4ac9-950f-9852627f23f2',
    scryfall_uri:
        'https://scryfall.com/card/usg/103/time-spiral?utm_source=api',
    layout: 'normal',
    highres_image: true,
    image_status: 'highres_scan',
    image_uris: {
        small:
            'https://c1.scryfall.com/file/scryfall-cards/small/front/f/3/f3d62dbd-63db-4ac9-950f-9852627f23f2.jpg?1562946525',
        normal:
            'https://c1.scryfall.com/file/scryfall-cards/normal/front/f/3/f3d62dbd-63db-4ac9-950f-9852627f23f2.jpg?1562946525',
        large:
            'https://c1.scryfall.com/file/scryfall-cards/large/front/f/3/f3d62dbd-63db-4ac9-950f-9852627f23f2.jpg?1562946525',
        png:
            'https://c1.scryfall.com/file/scryfall-cards/png/front/f/3/f3d62dbd-63db-4ac9-950f-9852627f23f2.png?1562946525',
        art_crop:
            'https://c1.scryfall.com/file/scryfall-cards/art_crop/front/f/3/f3d62dbd-63db-4ac9-950f-9852627f23f2.jpg?1562946525',
        border_crop:
            'https://c1.scryfall.com/file/scryfall-cards/border_crop/front/f/3/f3d62dbd-63db-4ac9-950f-9852627f23f2.jpg?1562946525',
    },
    mana_cost: '{4}{U}{U}',
    cmc: 6,
    type_line: 'Sorcery',
    oracle_text:
        'Exile Time Spiral. Each player shuffles their hand and graveyard into their library, then draws seven cards. You untap up to six lands.',
    colors: ['U'],
    color_identity: ['U'],
    keywords: [],
    legalities: {
        standard: 'not_legal',
        future: 'not_legal',
        historic: 'not_legal',
        gladiator: 'not_legal',
        pioneer: 'not_legal',
        modern: 'not_legal',
        legacy: 'legal',
        pauper: 'not_legal',
        vintage: 'legal',
        penny: 'not_legal',
        commander: 'legal',
        brawl: 'not_legal',
        duel: 'legal',
        oldschool: 'not_legal',
        premodern: 'banned',
    },
    games: ['paper', 'mtgo'],
    reserved: true,
    foil: false,
    nonfoil: true,
    oversized: false,
    promo: false,
    reprint: false,
    variation: false,
    set: 'usg',
    set_name: "Urza's Saga",
    set_type: 'expansion',
    set_uri:
        'https://api.scryfall.com/sets/c330df40-51db-4caf-bde6-48df6c181001',
    set_search_uri:
        'https://api.scryfall.com/cards/search?order=set&q=e%3Ausg&unique=prints',
    scryfall_set_uri: 'https://scryfall.com/sets/usg?utm_source=api',
    rulings_uri:
        'https://api.scryfall.com/cards/f3d62dbd-63db-4ac9-950f-9852627f23f2/rulings',
    prints_search_uri:
        'https://api.scryfall.com/cards/search?order=released&q=oracleid%3Acac55e46-b730-4569-b92c-a4b5922fc20c&unique=prints',
    collector_number: '103',
    digital: false,
    rarity: 'rare',
    card_back_id: '0aeebaf5-8c7d-4636-9e82-8c27447861f7',
    artist: 'Michael Sutfin',
    artist_ids: ['5ce7b3bd-53d2-49e6-b504-37191e8e9b17'],
    illustration_id: 'd8dc9bd3-3e5d-43d7-b003-34d96d351462',
    border_color: 'black',
    frame: '1997',
    full_art: false,
    textless: false,
    booster: true,
    story_spotlight: false,
    edhrec_rank: 2095,
    prices: {
        usd: '233.35',
        usd_foil: null,
        eur: '178.50',
        eur_foil: null,
        tix: '4.32',
    },
    related_uris: {
        gatherer:
            'https://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=10423',
        tcgplayer_infinite_articles:
            'https://infinite.tcgplayer.com/search?contentMode=article&game=magic&partner=scryfall&q=Time+Spiral&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall',
        tcgplayer_infinite_decks:
            'https://infinite.tcgplayer.com/search?contentMode=deck&game=magic&partner=scryfall&q=Time+Spiral&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall',
        edhrec: 'https://edhrec.com/route/?cc=Time+Spiral',
        mtgtop8:
            'https://mtgtop8.com/search?MD_check=1&SB_check=1&cards=Time+Spiral',
    },
    purchase_uris: {
        tcgplayer:
            'https://shop.tcgplayer.com/product/productsearch?id=7070&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall',
        cardmarket:
            'https://www.cardmarket.com/en/Magic/Products/Search?referrer=scryfall&searchString=Time+Spiral&utm_campaign=card_prices&utm_medium=text&utm_source=scryfall',
        cardhoarder:
            'https://www.cardhoarder.com/cards/12385?affiliate_id=scryfall&ref=card-profile&utm_campaign=affiliate&utm_medium=card&utm_source=scryfall',
    },
};

// Set up the mongo memory instance
beforeEach(async () => {
    mongoServer = new MongoMemoryServer();
    // Interactors use this to establish a connection
    process.env.MONGO_URI = await mongoServer.getUri();

    // Establish our own connection outside of interactors to inspect db
    client = await new MongoClient.connect(process.env.MONGO_URI, mongoOptions);

    // Create fake bulk collection
    const bulkCollection = await client
        .db(PROD_DB)
        .createCollection(SCRYFALL_BULK);

    // Insert one bulk card
    await bulkCollection.insert(bulkCard);

    // Add some cards to store inventory collection
    await addCardToInventory({
        quantity: 4,
        finishCondition: 'FOIL_NM',
        id: bulkCard.id,
        name: bulkCard.name,
        set_name: bulkCard.set_name,
        set: bulkCard.set,
        location: 'ch1',
    });
});

afterEach(async () => {
    await mongoServer.stop();
});

test('Fetching the bulk card to ensure it persisted', async () => {
    const foundDoc = await getCardsWithInfo('Time Spiral', true, 'ch1');

    expect(foundDoc.length).toBe(1);

    expect(foundDoc[0].name).toMatchInlineSnapshot(`"Time Spiral"`);
    expect(foundDoc[0].id).toMatchInlineSnapshot(
        `"f3d62dbd-63db-4ac9-950f-9852627f23f2"`
    );
    expect(foundDoc[0].qoh).toMatchInlineSnapshot(`
        Object {
          "FOIL_NM": 4,
        }
    `);
});
