import { ClubhouseLocation, Collection } from '../common/types';

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
