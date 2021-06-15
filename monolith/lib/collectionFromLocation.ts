import { ClubhouseLocation } from '../common/types';

interface Ch1Collection {
    cardInventory: 'card_inventory';
    salesData: 'sales_data';
    suspendedSales: 'suspended_sales';
    receivedCards: 'received_cards';
    users: 'users';
}

interface Ch2Collection {
    cardInventory: 'card_inventory_ch2';
    salesData: 'sales_data_ch2';
    suspendedSales: 'suspended_sales_ch2';
    receivedCards: 'received_cards_ch2';
    users: 'users';
}

export default function collectionFromLocation(
    location: ClubhouseLocation
): Ch1Collection | Ch2Collection {
    if (location === 'ch1') {
        return {
            cardInventory: 'card_inventory',
            salesData: 'sales_data',
            suspendedSales: 'suspended_sales',
            receivedCards: 'received_cards',
            users: 'users',
        };
    }
    if (location === 'ch2') {
        return {
            cardInventory: 'card_inventory_ch2',
            salesData: 'sales_data_ch2',
            suspendedSales: 'suspended_sales_ch2',
            receivedCards: 'received_cards_ch2',
            users: 'users',
        };
    }
}
