import React, { useState, createContext, FC } from 'react';
import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import createToast from '../common/createToast';
import makeAuthHeader from '../utils/makeAuthHeader';
import { InventoryCard, ScryfallApiCard } from '../utils/ScryfallCard';
import { GET_CARDS_WITH_INFO, RECEIVE_CARDS } from '../utils/api_resources';

interface Props {}

export enum Trade {
    Cash = 'CASH',
    Credit = 'CREDIT',
}

// Customers can only receive cash or credit for their assets
const TRADE_TYPES = { CASH: Trade.Cash, CREDIT: Trade.Credit };

export type ReceivingCard = InventoryCard & {
    uuid_key: string;
    cashPrice: number;
    marketPrice: number;
    creditPrice: number;
    tradeType: Trade;
};

interface Context {
    searchResults: InventoryCard[];
    receivingList: ReceivingCard[];
    handleSearchSelect: (term: string) => void;
    addToList: (
        quantity: number,
        card: InventoryCard,
        meta: AddToListMeta
    ) => void;
    removeFromList: (uuid: string) => void;
    activeTradeType: (uuid: string, tradeType: Trade) => void;
    selectAll: (trade: Trade) => void;
    commitToInventory: () => void;
    resetSearchResults: () => void;
}

const defaultContext: Context = {
    searchResults: [],
    receivingList: [],
    handleSearchSelect: () => null,
    addToList: () => null,
    removeFromList: () => null,
    activeTradeType: () => null,
    selectAll: () => null,
    commitToInventory: () => null,
    resetSearchResults: () => null,
};

interface AddToListMeta {
    cashPrice: number;
    marketPrice: number;
    creditPrice: number;
    finishCondition: string;
}

export const ReceivingContext = createContext<Context>(defaultContext);

const ReceivingProvider: FC<Props> = ({ children }) => {
    const [searchResults, setSearchResults] = useState<InventoryCard[]>([]);
    const [receivingList, setReceivingList] = useState<ReceivingCard[]>([]);

    /**
     * Fetches cards from the DB by title when a user selects a title after querying.
     * This function merges the data (inventory quantity and card objects) from two endpoints into one array.
     *
     * @param {String} term - the search term
     */
    const handleSearchSelect = async (term: string) => {
        try {
            const { data }: { data: ScryfallApiCard[] } = await axios.get(
                GET_CARDS_WITH_INFO,
                {
                    params: { title: term, matchInStock: false },
                    headers: makeAuthHeader(),
                }
            );

            setSearchResults(data.map((d) => new InventoryCard(d)));
        } catch (e) {
            console.log(e);
        }
    };

    /**
     * Adds a card to the receiving list, with a unique uuid
     */
    const addToList = (
        quantity: number,
        card: InventoryCard,
        { cashPrice, marketPrice, creditPrice, finishCondition }: AddToListMeta
    ) => {
        const previousState = [...receivingList];

        // Each line-item represents one card. Use _.times() to repeat
        const cardsToAdd: ReceivingCard[] = [...new Array(quantity)].map(() => {
            // TODO: This is funky as hell. We have to clone() to create a new object
            // or object.assign retains a reference to the merging object
            return _.clone(
                Object.assign(card, {
                    cashPrice,
                    marketPrice,
                    creditPrice,
                    finishCondition,
                    // Set to cash if customer doesn't want credit
                    tradeType: creditPrice === 0 ? Trade.Cash : Trade.Credit,
                    uuid_key: uuid(),
                })
            );
        });

        setReceivingList(_.sortBy([...previousState, ...cardsToAdd], 'name'));
    };

    /**
     * Removes a card from the receiving list using the uuid
     */
    const removeFromList = (uuid_key: string) => {
        const copiedState = [...receivingList];
        _.remove(copiedState, (e) => e.uuid_key === uuid_key); // Mutates array
        setReceivingList(copiedState);
    };

    /**
     * Determines whether line-items use cash or credit. Changes the tradeType by reference in the receivingList array
     * which changes the active prop in ReceivingListItem
     */
    const activeTradeType = (uuid_key: string, tradeType: Trade) => {
        const previousState = [...receivingList];
        const card = previousState.find((e) => e.uuid_key === uuid_key);
        if (card) {
            card.tradeType = TRADE_TYPES[tradeType];
        }
        setReceivingList(previousState);
    };

    /**
     * Sets all items to a tradeType, if possible
     *
     * @param {String} selectType - `CASH` or `CREDIT`
     */
    const selectAll = (selectType: Trade) => {
        const oldState = [...receivingList];
        const { CASH, CREDIT } = TRADE_TYPES;

        oldState.forEach((card, idx, arr) => {
            let selectedPrice = 0;

            if (selectType === CASH) selectedPrice = card.cashPrice;
            else if (selectType === CREDIT) selectedPrice = card.creditPrice;

            if (selectedPrice > 0) arr[idx].tradeType = selectType;
        });

        setReceivingList(oldState);
    };

    /**
     * Persists all passed cards to inventory
     */
    const commitToInventory = async () => {
        try {
            const cardsToCommit = receivingList.map((card) => {
                const { finishCondition, id, name, set_name, set } = card;
                return {
                    quantity: 1,
                    finishCondition,
                    id,
                    name,
                    set_name,
                    set,
                }; // Only committing one per line-item
            });

            await axios.post(
                RECEIVE_CARDS,
                { cards: cardsToCommit },
                { headers: makeAuthHeader() }
            );

            setSearchResults([]);
            setReceivingList([]);

            createToast({
                color: 'green',
                header: `${receivingList.length} cards were added to inventory!`,
                duration: 2000,
            });
        } catch (e) {
            console.log(e);
            createToast({
                color: 'red',
                header: 'Error',
                message: e.response.data || 'Error receiving cards',
                duration: 2000,
            });
        }
    };

    const resetSearchResults = () => setSearchResults([]);

    return (
        <ReceivingContext.Provider
            value={{
                searchResults,
                receivingList,
                handleSearchSelect,
                addToList,
                removeFromList,
                activeTradeType,
                selectAll,
                commitToInventory,
                resetSearchResults,
            }}
        >
            {children}
        </ReceivingContext.Provider>
    );
};

export default ReceivingProvider;
