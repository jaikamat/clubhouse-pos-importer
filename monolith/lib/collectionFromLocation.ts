import { ClubhouseLocation } from '../common/types';

export enum Collection {
    cardInventory = 'card_inventory',
    salesData = 'sales_data',
    suspendedSales = 'suspended_sales',
    receivedCards = 'received_cards',
    cardInventory2 = 'card_inventory_ch2',
    salesData2 = 'sales_data_ch2',
    suspendedSales2 = 'suspended_sales_ch2',
    receivedCards2 = 'received_cards_ch2',
    scryfallBulkCards = 'scryfall_bulk_cards',
    users = 'users',
}

interface Ch1Collection {
    cardInventory: Collection.cardInventory;
    salesData: Collection.salesData;
    suspendedSales: Collection.suspendedSales;
    receivedCards: Collection.receivedCards;
    users: Collection.users;
}

interface Ch2Collection {
    cardInventory: Collection.cardInventory2;
    salesData: Collection.salesData2;
    suspendedSales: Collection.suspendedSales2;
    receivedCards: Collection.receivedCards2;
    users: Collection.users;
}

export default function collectionFromLocation(
    location: ClubhouseLocation
): Ch1Collection | Ch2Collection {
    if (location === 'ch1') {
        return {
            cardInventory: Collection.cardInventory,
            salesData: Collection.salesData,
            suspendedSales: Collection.suspendedSales,
            receivedCards: Collection.receivedCards,
            users: Collection.users,
        };
    }
    if (location === 'ch2') {
        return {
            cardInventory: Collection.cardInventory2,
            salesData: Collection.salesData2,
            suspendedSales: Collection.suspendedSales2,
            receivedCards: Collection.receivedCards2,
            users: Collection.users,
        };
    }
}
