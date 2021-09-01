// CRA Exposes this as 'development' internally for `npm start`, and 'production' in built code
export const isProd = () => process.env.NODE_ENV === 'production';

/**
 * Asserts the env and returns the proper path prefix for resources
 */
export const getPrefix = () => {
    if (isProd()) {
        return 'https://clubhouse-collection.appspot.com';
    } else {
        return 'http://localhost:7331';
    }
};

/**
 * Asserts the env and returns the proper path postfix for GCF functions
 */
export const testEndpoint = () => {
    if (!isProd()) {
        return '_test';
    }
    return '';
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
export const GET_LIVE_PRICE = `https://us-central1-clubhouse-collection.cloudfunctions.net/getPriceFromTcg${testEndpoint()}`;
