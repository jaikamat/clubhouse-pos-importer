import { ClubhouseLocation } from '../interactors/getJwt';

interface Ch1Collection {
    cardInventory: 'card_inventory';
    salesData: 'sales_data';
    suspendedSales: 'suspended_sales';
    receivedCards: 'received_cards';
}

interface Ch2Collection {
    cardInventory: 'card_inventory_ch2';
    salesData: 'sales_data_ch2';
    suspendedSales: 'suspended_sales_ch2';
    receivedCards: 'received_cards_ch2';
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
        };
    }
    if (location === 'ch2') {
        return {
            cardInventory: 'card_inventory_ch2',
            salesData: 'sales_data_ch2',
            suspendedSales: 'suspended_sales_ch2',
            receivedCards: 'received_cards_ch2',
        };
    }
}
