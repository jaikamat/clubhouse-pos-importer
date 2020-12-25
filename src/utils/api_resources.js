// Maps all GCF and Scryfall API endpoints for code re-use
const { REACT_APP_ENVIRONMENT } = process.env;

/**
 * Check the environment for dev - if dev, we reach out
 * to all endpoints appended by `_test` instead of production
 */
const env = REACT_APP_ENVIRONMENT === 'development' ? '_test' : '';

/**
 * Asserts the development env and returns the proper path prefix for resources
 */
const getPrefix = () => {
    return REACT_APP_ENVIRONMENT === 'development'
        ? 'http://localhost:7331'
        : 'https://clubhouse-collection.appspot.com';
};

const endpoints = {
    FINISH_SALE: `${getPrefix()}/auth/finishSale`,
    ADD_CARD_TO_INVENTORY: `${getPrefix()}/auth/addCardToInventory`,
    RECEIVE_CARDS: `${getPrefix()}/auth/receiveCards`,
    GET_CARDS_BY_FILTER: `${getPrefix()}/auth/getCardsByFilter`,
    GET_SET_NAMES: `${getPrefix()}/getDistinctSetNames`,
    SUSPEND_SALE: `${getPrefix()}/auth/suspendSale`,
    LOGIN: `${getPrefix()}/jwt`,
    GET_SALES_BY_TITLE: `${getPrefix()}/auth/getSaleByTitle`,
    GET_ALL_SALES: `${getPrefix()}/auth/allSales`,
    GET_CARDS_WITH_INFO: `${getPrefix()}/getCardsWithInfo`,
    SCRYFALL_AUTOCOMPLETE: 'https://api.scryfall.com/cards/autocomplete',
    SCRYFALL_SEARCH: 'https://api.scryfall.com/cards/search',
    GET_LIVE_PRICE: `https://us-central1-clubhouse-collection.cloudfunctions.net/getPriceFromTcg${env}`,
};

module.exports = endpoints;
