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

type UrlCreator = (s: string) => string;

export const publicEndpoint: UrlCreator = (s) => `${getPrefix()}/${s}`;
export const authedEndpoint: UrlCreator = (s) => `${getPrefix()}/auth/${s}`;
export const gcfEndpoint: UrlCreator = (s) => `${s}${testEndpoint()}`;

// Public endpoints
export const LOGIN = publicEndpoint('jwt');
export const AUTOCOMPLETE = publicEndpoint('autocomplete');
export const GET_CARDS_WITH_INFO_PUBLIC = publicEndpoint('getCardsWithInfo');
export const GET_CARD_FROM_ALL_LOCATIONS = publicEndpoint(
    'getCardFromAllLocations'
);

// Private endpoints
export const GET_CARDS_BY_FILTER = authedEndpoint('getCardsByFilter');
export const GET_SET_NAMES = authedEndpoint('getDistinctSetNames');
export const SUSPEND_SALE = authedEndpoint('suspendSale');
export const GET_SALES_BY_TITLE = authedEndpoint('getSaleByTitle');
export const RECEIVING = authedEndpoint('getReceivedCards');
export const GET_ALL_SALES = authedEndpoint('allSales');
export const GET_CARDS_WITH_INFO = authedEndpoint('getCardsWithInfo');
export const GET_REPORT = authedEndpoint('getSalesReport');
export const GET_BULK_CARDS = authedEndpoint('bulkSearch');
export const FINISH_SALE = authedEndpoint('finishSale');
export const ADD_CARD_TO_INVENTORY = authedEndpoint('addCardToInventory');
export const RECEIVE_CARDS = authedEndpoint('receiveCards');

// GCF endpoint
export const GET_LIVE_PRICE = gcfEndpoint(
    `https://us-central1-clubhouse-collection.cloudfunctions.net/getPriceFromTcg`
);
