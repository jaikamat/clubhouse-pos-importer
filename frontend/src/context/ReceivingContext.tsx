import React, { useState, createContext, FC } from 'react';
import { sortBy } from 'lodash';
import { v4 as uuid } from 'uuid';
import createToast from '../common/createToast';
import receivingQuery from './receivingQuery';
import cardSearchQuery from './cardSearchQuery';
import { ScryfallCard } from '../utils/ScryfallCard';

interface Props {}

export enum Trade {
    Cash = 'CASH',
    Credit = 'CREDIT',
}

// Customers can only receive cash or credit for their assets
const TRADE_TYPES = { CASH: Trade.Cash, CREDIT: Trade.Credit };

export type ReceivingCard = ScryfallCard & {
    uuid_key: string;
    finishCondition: string;
    cashPrice: number | null;
    marketPrice: number | null;
    creditPrice: number | null;
    tradeType: Trade;
};

interface Context {
    searchResults: ScryfallCard[];
    receivingList: ReceivingCard[];
    handleSearchSelect: (term: string) => void;
    addToList: (
        quantity: number,
        card: ScryfallCard,
        meta: AddToListMeta
    ) => void;
    removeFromList: (uuid: string) => void;
    activeTradeType: (uuid: string, tradeType: Trade) => void;
    selectAll: (trade: Trade) => void;
    commitToInventory: (
        customerName: string,
        customerContact: string | null
    ) => void;
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
    cashPrice: number | null;
    marketPrice: number | null;
    creditPrice: number | null;
    finishCondition: string;
}

export const ReceivingContext = createContext<Context>(defaultContext);

const ReceivingProvider: FC<Props> = ({ children }) => {
    const [searchResults, setSearchResults] = useState<ScryfallCard[]>([]);
    const [receivingList, setReceivingList] = useState<ReceivingCard[]>([]);

    const handleSearchSelect = async (term: string) => {
        const cards = await cardSearchQuery({
            cardName: term,
            inStockOnly: false,
        });

        setSearchResults(cards);
    };

    /**
     * Adds a card to the receiving list, with a unique uuid
     */
    const addToList = (
        quantity: number,
        card: ScryfallCard,
        { cashPrice, marketPrice, creditPrice, finishCondition }: AddToListMeta
    ) => {
        const previousState = [...receivingList];

        // Each line-item represents one card
        const cardsToAdd: ReceivingCard[] = [...new Array(quantity)].map(() => {
            const newCard: ReceivingCard = {
                ...card,
                cashPrice,
                marketPrice,
                creditPrice,
                finishCondition,
                // Set to cash if customer doesn't want credit
                tradeType: creditPrice === 0 ? Trade.Cash : Trade.Credit,
                uuid_key: uuid(),
            };

            return newCard;
        });

        setReceivingList(sortBy([...previousState, ...cardsToAdd], 'name'));
    };

    /**
     * Removes a card from the receiving list using the uuid
     */
    const removeFromList = (uuid_key: string) => {
        const copiedState = [...receivingList];
        setReceivingList(copiedState.filter((e) => e.uuid_key !== uuid_key));
    };

    /**
     * Determines whether line-items use cash or credit.
     * Assigns a new trade type.
     */
    const activeTradeType = (uuid_key: string, tradeType: Trade) => {
        setReceivingList(
            [...receivingList].map((card) => {
                if (card.uuid_key === uuid_key) {
                    card.tradeType = TRADE_TYPES[tradeType];
                }
                return card;
            })
        );
    };

    /**
     * Sets all items to a tradeType, if possible
     */
    const selectAll = (selectType: Trade) => {
        const { CASH, CREDIT } = TRADE_TYPES;

        const newState = [...receivingList].map((card) => {
            if (
                selectType === CASH &&
                card.cashPrice !== null &&
                card.cashPrice > 0
            )
                card.tradeType = selectType;
            else if (
                selectType === CREDIT &&
                card.creditPrice !== null &&
                card.creditPrice > 0
            )
                card.tradeType = selectType;

            return card;
        });

        setReceivingList(newState);
    };

    /**
     * Persists all passed cards to inventory
     */
    const commitToInventory = async (
        customerName: string,
        customerContact: string | null
    ) => {
        try {
            const cardsToCommit = receivingList.map((card) => ({
                quantity: 1, // Only committing one per line-item
                id: card.id,
                name: card.name,
                set_name: card.set_name,
                finishCondition: card.finishCondition,
                set: card.set,
                creditPrice: card.creditPrice,
                cashPrice: card.cashPrice,
                marketPrice: card.marketPrice,
                tradeType: card.tradeType,
            }));

            await receivingQuery({
                cards: cardsToCommit,
                customerName,
                customerContact,
            });

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
