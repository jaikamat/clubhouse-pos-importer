import $ from 'jquery';
import React, { createContext, FC, useContext, useState } from 'react';
import sortSaleList from '../Sale/sortSaleList';
import { useToastContext } from '../ui/ToastContext';
import { ClientCard, FinishCondition } from '../utils/ClientCard';
import cardSearchQuery from './cardSearchQuery';
import createSuspendedSaleQuery from './createSuspendedSaleQuery';
import deleteSuspendedSaleQuery from './deleteSuspendedSaleQuery';
import finishSaleQuery from './finishSaleQuery';
import getSuspendedSaleQuery, { SuspendedSale } from './getSuspendedSaleQuery';

interface Props {}

interface SuspendSaleArgs {
    customerName: string;
    notes: string;
}

export type SaleListCard = ClientCard & {
    finishCondition: FinishCondition;
    qtyToSell: number;
    price: number;
};

export interface Context {
    saleListCards: SaleListCard[];
    searchResults: ClientCard[];
    searchTerm: string;
    suspendedSale: SuspendedSale;
    handleResultSelect: (term: string) => void;
    addToSaleList: (
        card: ClientCard,
        finishCondition: FinishCondition,
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

const SaleContext = createContext<Context>({
    saleListCards: [],
    searchResults: [],
    searchTerm: '',
    suspendedSale: defaultSuspendedSale,
    handleResultSelect: () => null,
    addToSaleList: () => null,
    removeFromSaleList: () => null,
    restoreSale: () => null,
    suspendSale: () => null,
    deleteSuspendedSale: () => null,
    finalizeSale: () => null,
    resetSaleState: () => null,
});

export const SaleProvider: FC<Props> = ({ children }) => {
    const { createToast, createErrorToast } = useToastContext();
    const [saleListCards, setSaleListCards] = useState<SaleListCard[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<ClientCard[]>([]);
    const [suspendedSale, setSuspendedSale] =
        useState<SuspendedSale>(defaultSuspendedSale);

    /**
     * Executes after a user selects an autocompleted suggestion
     */
    const handleResultSelect = async (term: string) => {
        const cards = await cardSearchQuery({
            cardName: term,
            inStockOnly: true,
        });

        setSearchResults(cards);
        setSearchTerm(term);

        if (cards.length === 0) {
            $('#searchBar').focus().select();
        }
    };

    /**
     * Adds product to the sale list
     */
    const addToSaleList = (
        card: ClientCard,
        finishCondition: FinishCondition,
        qtyToSell: number,
        price: number
    ) => {
        const oldState = [...saleListCards];

        const newCard: SaleListCard = {
            ...card,
            finishCondition,
            qtyToSell,
            price,
        };

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

            const modeledData = sale.list.map((c) => c);

            setSaleListCards(modeledData);
            setSuspendedSale(sale);

            createToast({
                severity: 'success',
                message: `You are viewing ${sale.name}'s sale`,
            });
        } catch (err) {
            console.log(err);
            createErrorToast(err);
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
                saleList: saleListCards.map(
                    ({
                        id,
                        price,
                        qtyToSell,
                        finishCondition,
                        name,
                        set_name,
                    }) => ({
                        id,
                        price,
                        qtyToSell,
                        finishCondition,
                        name,
                        set_name,
                    })
                ),
            });

            resetSaleState();

            createToast({
                severity: 'success',
                message: `${data.ops[0].name}'s sale was suspended`,
            });
        } catch (err) {
            console.log(err);
            createErrorToast(err);
        }
    };

    const deleteSuspendedSale = async () => {
        try {
            const { _id, name } = suspendedSale;
            await deleteSuspendedSaleQuery(_id);

            resetSaleState();

            createToast({
                severity: 'success',
                message: `${name}'s sale was deleted`,
            });
        } catch (err) {
            console.log(err);
            createErrorToast(err);
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

            const { sale_data } = await finishSaleQuery({
                cards: saleListCards.map((slc) => ({
                    id: slc.id,
                    price: slc.price,
                    qtyToSell: slc.qtyToSell,
                    name: slc.name,
                    set_name: slc.set_name,
                    finishCondition: slc.finishCondition,
                })),
            });

            createToast({
                severity: 'success',
                message: `Sale created: ID #${sale_data.Sale.saleID}`,
            });

            resetSaleState();
        } catch (err) {
            createErrorToast(err);
            throw err;
        }
    };

    const resetSaleState = () => {
        setSaleListCards([]);
        setSearchResults([]);
        setSearchTerm('');
        setSuspendedSale(defaultSuspendedSale);
    };

    return (
        <SaleContext.Provider
            value={{
                saleListCards,
                searchTerm,
                searchResults,
                suspendedSale,
                handleResultSelect,
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

export const useSaleContext = () => useContext(SaleContext);
