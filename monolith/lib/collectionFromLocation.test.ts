import collectionFromLocation from './collectionFromLocation';

// TODO: We should figure out how to use this with ts-jest
// Currently, we are rebuilding the js source and then testing against
// that via `roots: ['built/']`, but we should be testing against this instead
test('collection from location', () => {
    expect(collectionFromLocation('ch1')).toStrictEqual({
        cardInventory: 'card_inventory',
        salesData: 'sales_data',
        suspendedSales: 'suspended_sales',
        receivedCards: 'received_cards',
        users: 'users',
    });

    expect(collectionFromLocation('ch2')).toStrictEqual({
        cardInventory: 'card_inventory_ch2',
        salesData: 'sales_data_ch2',
        suspendedSales: 'suspended_sales_ch2',
        receivedCards: 'received_cards_ch2',
        users: 'users',
    });
});
