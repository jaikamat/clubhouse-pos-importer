// Maps all GCF and Scryfall API endpoints for code re-use

module.exports = {
    GET_CARDS_BY_TITLE:
        'https://us-central1-clubhouse-collection.cloudfunctions.net/getCardsByTitle',
    GET_CARDS_FROM_INVENTORY:
        'https://us-central1-clubhouse-collection.cloudfunctions.net/getCardsFromInventory',
    FINISH_SALE:
        'https://us-central1-clubhouse-collection.cloudfunctions.net/finishSale',
    ADD_CARD_TO_INVENTORY:
        'https://us-central1-clubhouse-collection.cloudfunctions.net/addCardToInventory',
    GET_INVENTORY_QUERY:
        'https://us-central1-clubhouse-collection.cloudfunctions.net/inventorySearchQuery',
    GET_SALES_BY_TITLE:
        'https://us-central1-clubhouse-collection.cloudfunctions.net/getSales',
    LOGIN: 'https://us-central1-clubhouse-collection.cloudfunctions.net/getJwt',
    SCRYFALL_AUTOCOMPLETE: 'https://api.scryfall.com/cards/autocomplete',
    SCRYFALL_SEARCH: 'https://api.scryfall.com/cards/search',
    SCRYFALL_ID_SEARCH: 'https://api.scryfall.com/cards/'
};
