import React, { useState, createContext, FC } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { SUSPEND_SALE, FINISH_SALE } from '../utils/api_resources';
import { InventoryCard } from '../utils/ScryfallCard';
import sortSaleList from '../utils/sortSaleList';
import createToast from '../common/createToast';
import makeAuthHeader from '../utils/makeAuthHeader';

interface Props {}

interface SuspendSaleArgs {
    customerName: string;
    notes: string;
}

export interface SuspendedSale {
    _id: string;
    name: string;
    notes: string;
    // TODO: is this the right type?
    list: SaleListCard[];
}

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

export type SaleListCard = InventoryCard & {
    finishCondition: string;
    qtyToSell: number;
    price: number;
};

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
        // TODO: is this stable? We have to use
        // Object.assign() to preserve getter and setter methods
        const newCard = _.clone(
            Object.assign(card, {
                finishCondition,
                qtyToSell,
                price,
            })
        );

        const oldState = [...saleListCards];
        // TODO: do we have to re-model this??
        // const modeledCard = new InventoryCard(newCard);
        const modeledCard = newCard;

        // Need to make sure same ID's with differing conditions are separate line-items
        const idx = oldState.findIndex((el) => {
            return (
                el.id === newCard.id && el.finishCondition === finishCondition
            );
        });

        if (idx !== -1) {
            oldState.splice(idx, 1, modeledCard);
        } else {
            oldState.push(modeledCard);
        }

        // Sorting the saleList cards here, on add
        const sortedCards = sortSaleList(oldState);

        setSaleListCards(sortedCards);
    };

    /**
     * Removes product from the sale list
     */
    const removeFromSaleList = (id: string, finishCondition: string) => {
        const newState = _.reject([...saleListCards], (el) => {
            return el.id === id && el.finishCondition === finishCondition;
        });

        setSaleListCards(newState);
    };

    /**
     * Restores a sale (assigns a saleList to state) from a suspended sale from the db
     */
    const restoreSale = async (id: string) => {
        try {
            const { data }: { data: SuspendedSale } = await axios.get(
                `${SUSPEND_SALE}/${id}`,
                {
                    headers: makeAuthHeader(),
                }
            );
            // TODO: Is this going to map correctly?
            // const modeledData = data.list.map((c) => new InventoryCard(c));
            const modeledData = data.list.map((c) => c);

            setSaleListCards(modeledData);
            setSuspendedSale(data);

            createToast({
                color: 'green',
                header: `You are viewing ${data.name}'s sale`,
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
                await axios.delete(`${SUSPEND_SALE}/${_id}`, {
                    headers: makeAuthHeader(),
                }); // If we're suspended, delete the previous to replace

            const { data } = await axios.post(
                SUSPEND_SALE,
                {
                    customerName: customerName,
                    notes: notes,
                    saleList: saleListCards,
                },
                { headers: makeAuthHeader() }
            );

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
            await axios.delete(`${SUSPEND_SALE}/${_id}`, {
                headers: makeAuthHeader(),
            });

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
            if (!!_id)
                await axios.delete(`${SUSPEND_SALE}/${_id}`, {
                    headers: makeAuthHeader(),
                });

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
