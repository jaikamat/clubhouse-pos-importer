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

export const FINISH_SALE = `${getPrefix()}/auth/finishSale`;
export const GET_CARD_FROM_ALL_LOCATIONS = `${getPrefix()}/getCardFromAllLocations`;
export const ADD_CARD_TO_INVENTORY = `${getPrefix()}/auth/addCardToInventory`;
export const RECEIVE_CARDS = `${getPrefix()}/auth/receiveCards`;
export const GET_CARDS_BY_FILTER = `${getPrefix()}/auth/getCardsByFilter`;
export const GET_SET_NAMES = `${getPrefix()}/auth/getDistinctSetNames`;
export const SUSPEND_SALE = `${getPrefix()}/auth/suspendSale`;
export const LOGIN = `${getPrefix()}/jwt`;
export const GET_SALES_BY_TITLE = `${getPrefix()}/auth/getSaleByTitle`;
export const RECEIVING = `${getPrefix()}/auth/getReceivedCards`;
export const GET_ALL_SALES = `${getPrefix()}/auth/allSales`;
export const GET_CARDS_WITH_INFO_PUBLIC = `${getPrefix()}/getCardsWithInfo`;
export const GET_CARDS_WITH_INFO = `${getPrefix()}/auth/getCardsWithInfo`;
export const GET_REPORT = `${getPrefix()}/auth/getSalesReport`;
export const GET_BULK_CARDS = `${getPrefix()}/auth/bulkSearch`;
export const AUTOCOMPLETE = `${getPrefix()}/autocomplete`;
export const SCRYFALL_SEARCH = 'https://api.scryfall.com/cards/search';
export const GET_LIVE_PRICE = `https://us-central1-clubhouse-collection.cloudfunctions.net/getPriceFromTcg${env}`;
