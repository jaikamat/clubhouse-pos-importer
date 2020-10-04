// Maps all GCF and Scryfall API endpoints for code re-use
const { REACT_APP_ENVIRONMENT } = process.env;

/**
 * Check the environment for dev - if dev, we reach out
 * to all endpoints appended by `_test` instead of production
 */
const env = REACT_APP_ENVIRONMENT === 'development' ? '_test' : '';

const isTest = REACT_APP_ENVIRONMENT === 'development';

const endpoints = {
    FINISH_SALE: `https://us-central1-clubhouse-collection.cloudfunctions.net/finishSale${env}`,
    ADD_CARD_TO_INVENTORY: isTest
        ? `clubhouse-collection.appspot.com/addCardsToInventory`
        : `https://us-central1-clubhouse-collection.cloudfunctions.net/addCardToInventory${env}`,
    RECEIVE_CARDS: `https://us-central1-clubhouse-collection.cloudfunctions.net/receiveCards${env}`,
    GET_SALES_BY_TITLE: `https://us-central1-clubhouse-collection.cloudfunctions.net/getSales${env}`,
    GET_SCRYFALL_BULK_BY_TITLE: `https://us-central1-clubhouse-collection.cloudfunctions.net/getScryfallBulkCardsByTitle${env}`,
    GET_CARDS_BY_FILTER: `https://us-central1-clubhouse-collection.cloudfunctions.net/getCardsByFilter${env}`,
    GET_SET_NAMES: `https://us-central1-clubhouse-collection.cloudfunctions.net/getCardsByFilter${env}/set_names`,
    SUSPEND_SALE: `https://us-central1-clubhouse-collection.cloudfunctions.net/suspendSale${env}`,
    LOGIN: isTest
        ? `clubhouse-collection.appspot.com/jwt`
        : `https://us-central1-clubhouse-collection.cloudfunctions.net/getJwt${env}`,
    GET_ALL_SALES: `https://us-central1-clubhouse-collection.cloudfunctions.net/getSales${env}/sales`,
    GET_CARDS_WITH_INFO: isTest
        ? `clubhouse-collection.appspot.com/getCardsWithInfo`
        : `https://us-central1-clubhouse-collection.cloudfunctions.net/getCardsWithInfo${env}`,
    SCRYFALL_AUTOCOMPLETE: 'https://api.scryfall.com/cards/autocomplete',
    SCRYFALL_SEARCH: 'https://api.scryfall.com/cards/search',
    GET_LIVE_PRICE: `https://us-central1-clubhouse-collection.cloudfunctions.net/getPriceFromTcg${env}`,
};

module.exports = endpoints;
