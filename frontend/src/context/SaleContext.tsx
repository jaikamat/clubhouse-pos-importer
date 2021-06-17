import React, { useState, createContext, FC } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { SUSPEND_SALE, FINISH_SALE } from '../utils/api_resources';
import { InventoryCard } from '../utils/ScryfallCard';
import sortSaleList from '../utils/sortSaleList';
import createToast from '../common/createToast';
import makeAuthHeader from '../utils/makeAuthHeader';
import getSuspendedSaleQuery, { SuspendedSale } from './getSuspendedSaleQuery';
import deleteSuspendedSaleQuery from './deleteSuspendedSaleQuery';
import createSuspendedSaleQuery from './createSuspendedSaleQuery';

interface Props {}

interface SuspendSaleArgs {
    customerName: string;
    notes: string;
}

export type SaleListCard = InventoryCard & {
    finishCondition: string;
    qtyToSell: number;
    price: number;
};

export interface SaleContext {
    saleListCards: SaleListCard[];
    suspendedSale: SuspendedSale;
    addToSaleList: (
        card: InventoryCard,
        finishCondition: string,
        qtyToSell: number,
        price: number
    ) => void;
    removeFromSaleList: (id: string, finishCondition: string) => void;
    restoreSale: (saleId: string) => void;
    suspendSale: (args: SuspendSaleArgs) => void;
    deleteSuspendedSale: () => void;
    finalizeSale: () => void;
    resetSaleState: () => void;
}

const defaultSuspendedSale: SuspendedSale = {
    _id: '',
    name: '',
    notes: '',
    list: [],
};

export const SaleContext = createContext<SaleContext>({
    saleListCards: [],
    suspendedSale: defaultSuspendedSale,
    addToSaleList: () => null,
    removeFromSaleList: () => null,
    restoreSale: () => null,
    suspendSale: () => null,
    deleteSuspendedSale: () => null,
    finalizeSale: () => null,
    resetSaleState: () => null,
});

export const SaleProvider: FC<Props> = ({ children }) => {
    const [saleListCards, setSaleListCards] = useState<SaleListCard[]>([]);
    const [suspendedSale, setSuspendedSale] = useState<SuspendedSale>(
        defaultSuspendedSale
    );

    /**
     * Adds product to the sale list
     */
    const addToSaleList = (
        card: InventoryCard,
        finishCondition: string,
        qtyToSell: number,
        price: number
    ) => {
        const oldState = [...saleListCards];

        // TODO: is this stable? We have to use Object.assign() to preserve getter and setter methods
        const newCard = _.clone(
            Object.assign(card, {
                finishCondition,
                qtyToSell,
                price,
            })
        );

        // Need to make sure same ID's with differing conditions are separate line-items
        const idx = oldState.findIndex((el) => {
            return (
                el.id === newCard.id && el.finishCondition === finishCondition
            );
        });

        if (idx !== -1) {
            oldState.splice(idx, 1, newCard);
        } else {
            oldState.push(newCard);
        }

        setSaleListCards(sortSaleList(oldState));
    };

    /**
     * Removes product from the sale list
     */
    const removeFromSaleList = (id: string, finishCondition: string) => {
        const newState = [...saleListCards].filter((c) => {
            return !(c.id === id && c.finishCondition === finishCondition);
        });

        setSaleListCards(newState);
    };

    /**
     * Restores a sale (assigns a saleList to state) from a suspended sale from the db
     */
    const restoreSale = async (id: string) => {
        try {
            const sale = await getSuspendedSaleQuery(id);
            // TODO: Is this going to map correctly?
            // const modeledData = data.list.map((c) => new InventoryCard(c));
            const modeledData = sale.list.map((c) => c);

            setSaleListCards(modeledData);
            setSuspendedSale(sale);

            createToast({
                color: 'green',
                header: `You are viewing ${sale.name}'s sale`,
            });
        } catch (e) {
            console.log(e.response);
            createToast({ color: 'red', header: `Error` });
        }
    };

    /**
     * Suspends a sale (persists it to mongo) via the SuspendedSale component and API
     */
    const suspendSale = async ({
        customerName,
        notes,
    }: {
        customerName: string;
        notes: string;
    }) => {
        const { _id } = suspendedSale;

        try {
            if (!!_id)
                // If we're suspended, delete the previous to replace
                await deleteSuspendedSaleQuery(_id);

            const data = await createSuspendedSaleQuery({
                customerName: customerName,
                notes: notes,
                saleList: saleListCards,
            });

            resetSaleState();

            createToast({
                color: 'green',
                header: `${data.ops[0].name}'s sale was suspended`,
            });
        } catch (e) {
            console.log(e.response);
            createToast({
                color: 'red',
                header: `Error`,
                message: e.response.data || 'Error suspending sale',
            });
        }
    };

    const deleteSuspendedSale = async () => {
        try {
            const { _id, name } = suspendedSale;
            await deleteSuspendedSaleQuery(_id);

            resetSaleState();

            createToast({
                color: 'green',
                header: `${name}'s sale was deleted`,
            });
        } catch (e) {
            console.log(e.response);
            createToast({
                color: 'red',
                header: `Error`,
                message: e.response.data || 'Error deleting suspended sale',
            });
        }
    };

    /**
     * Extracts the saleList state and uses it to complete sale
     */
    const finalizeSale = async () => {
        const { _id } = suspendedSale;

        try {
            // Must delete currently suspended sale to faithfully restore inventory prior to sale
            if (!!_id) await deleteSuspendedSaleQuery(_id);

            const { data } = await axios.post(
                FINISH_SALE,
                { cards: saleListCards },
                { headers: makeAuthHeader() }
            );

            const saleID = data.sale_data.Sale.saleID;

            createToast({
                color: 'green',
                header: 'Sale created in Lightspeed!',
                message: `The id number is #${saleID}`,
            });

            resetSaleState();
        } catch (e) {
            createToast({
                color: 'red',
                header: 'Error',
                message: e.response.data || 'Sale was not created',
            });

            resetSaleState();
        }
    };

    const resetSaleState = () => {
        setSaleListCards([]);
        setSuspendedSale(defaultSuspendedSale);
    };

    return (
        <SaleContext.Provider
            value={{
                saleListCards,
                suspendedSale,
                addToSaleList,
                removeFromSaleList,
                restoreSale,
                suspendSale,
                deleteSuspendedSale,
                finalizeSale,
                resetSaleState,
            }}
        >
            {children}
        </SaleContext.Provider>
    );
};
