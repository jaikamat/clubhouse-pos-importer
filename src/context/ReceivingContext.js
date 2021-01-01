import React, { useState } from 'react';
import _ from 'lodash';
import uuid from 'uuid';
import axios from 'axios';
import createToast from '../common/createToast';
import makeAuthHeader from '../utils/makeAuthHeader';
import { InventoryCard } from '../utils/ScryfallCard';
import { GET_CARDS_WITH_INFO, RECEIVE_CARDS } from '../utils/api_resources';

const TRADE_TYPES = { CASH: 'CASH', CREDIT: 'CREDIT' }; // Customers can only receive cash or credit for their assets

// Models the line item in the Receiving List and sets a unique UUID key on each
class LineItem extends InventoryCard {
    constructor(cardProps) {
        super(cardProps);

        const { cashPrice, marketPrice, creditPrice } = cardProps;

        this.cashPrice = cashPrice;
        this.marketPrice = marketPrice;
        this.creditPrice = creditPrice;
        this.uuid_key = uuid();

        if (creditPrice === 0) this.tradeType = TRADE_TYPES.CASH;
        // Set to cash if customer doesn't want credit
        else this.tradeType = TRADE_TYPES.CREDIT; // Otherwise, default to credit
    }
}

export const ReceivingContext = React.createContext();

export function ReceivingProvider(props) {
    const [searchResults, setSearchResults] = useState([]);
    const [receivingList, setReceivingList] = useState([]);

    /**
     * Fetches cards from the DB by title when a user selects a title after querying.
     * This function merges the data (inventory quantity and card objects) from two endpoints into one array.
     *
     * @param {String} term - the search term
     */
    const handleSearchSelect = async (term) => {
        try {
            const { data } = await axios.get(GET_CARDS_WITH_INFO, {
                params: { title: term, matchInStock: false },
                headers: makeAuthHeader(),
            });

            setSearchResults(data.map((d) => new InventoryCard(d)));
        } catch (e) {
            console.log(e);
        }
    };

    /**
     * Adds a card to the receiving list, with a unique uuid
     */
    const addToList = (quantity, cardProps) => {
        const previousState = [...receivingList];

        // Each line-item represents one card. Use _.times() to repeat
        const newState = previousState.concat(
            _.times(quantity, () => new LineItem(cardProps))
        );

        setReceivingList(_.sortBy(newState, 'name'));
    };

    /**
     * Removes a card from the receiving list using the uuid
     */
    const removeFromList = (uuid_key) => {
        const copiedState = [...receivingList];
        _.remove(copiedState, (e) => e.uuid_key === uuid_key); // Mutates array
        setReceivingList(copiedState);
    };

    /**
     * Determines whether line-items use cash or credit. Changes the tradeType by reference in the receivingList array
     * which changes the active prop in ReceivingListItem
     */
    const activeTradeType = (uuid_key, tradeType) => {
        const previousState = [...receivingList];
        const card = previousState.find((e) => e.uuid_key === uuid_key);
        card.tradeType = TRADE_TYPES[tradeType];
        setReceivingList(previousState);
    };

    /**
     * Sets all items to a tradeType, if possible
     *
     * @param {String} selectType - `CASH` or `CREDIT`
     */
    const selectAll = (selectType) => {
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
                header: `Something went wrong...`,
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
            {props.children}
        </ReceivingContext.Provider>
    );
}
