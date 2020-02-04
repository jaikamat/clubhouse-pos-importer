import React, { useState } from 'react';
import SearchBar from '../SearchBar';
import axios from 'axios';
import makeAuthHeader from '../makeAuthHeader';
import ReceivingSearchList from './ReceivingSearchList';
import { Segment, Header, Icon, Grid, Divider, Table } from 'semantic-ui-react'
import { ADD_CARD_TO_INVENTORY, GET_CARD_QTY_FROM_INVENTORY, GET_SCRYFALL_BULK_BY_TITLE } from '../api_resources';
import ReceivingListItem from './ReceivingListItem';
import ReceivingListTotals from './ReceivingListTotals';
import _ from 'lodash';
import uuid from 'uuid'; // Used to crete unique keys for the list

// Defines whether the receivingListItem uses cash or credit for trade types
const TRADE_TYPE = {
    CASH: 'CASH',
    CREDIT: 'CREDIT'
}

function DefaultPlaceholder({ active, headerText }) {
    return (
        <React.Fragment>
            {active &&
                <Segment placeholder>
                    <Header icon>
                        <Icon name="search" />
                        <em>{headerText}</em>
                    </Header>
                </Segment>}
        </React.Fragment>
    )
}

export default function Receiving() {
    const [searchResults, setSearchResults] = useState([]);
    const [receivingList, setReceivingList] = useState([]);

    /**
     * Fetches cards from the DB by title when a user selects a title after querying.
     * This function merges the data (inventory quantity and card objects) from two endpoints into one array.
     * 
     * @param {String} term - the search term
     */
    const handleSearchSelect = async term => {
        try {
            const { data } = await axios.get(
                GET_SCRYFALL_BULK_BY_TITLE,
                {
                    params: { title: term },
                    headers: makeAuthHeader()
                }
            );

            const ids = data.map(el => el.id);

            // Fetches only the in-stock qty of a card tied to an `id`
            const inventoryRes = await axios.post(
                GET_CARD_QTY_FROM_INVENTORY,
                { scryfallIds: ids },
                { headers: makeAuthHeader() }
            );

            const mergedData = data.map(d => {
                return { ...d, inventoryQty: inventoryRes.data[d.id] } // inventoryQty will be `undefined` if no qty (prop not found)
            });

            setSearchResults(mergedData);
        } catch (e) {
            console.log(e);
        }
    };

    /**
     * Adds a card to the receiving list, with a unique uuid for identification
     */
    const addToList = ({ quantity, cashPrice, creditPrice, finishCondition, cardInfo }) => {

        const previousState = [...receivingList];
        let initialTradeType = TRADE_TYPE.CREDIT;

        // If the creditPrice is 0 default to cash
        if (!creditPrice) initialTradeType = TRADE_TYPE.CASH;

        // Each line-item represents one card. Use _.times() to repeat
        const newState = previousState.concat(_.times(quantity, idx => {
            return { cashPrice, creditPrice, finishCondition, ...cardInfo, uuid_key: uuid(), tradeType: initialTradeType }
        }))

        setReceivingList(newState);
    }

    /**
     * Removes a card from the receiving list using the uuid
     */
    const removeFromList = (uuid_key) => {
        const copiedState = [...receivingList];
        _.remove(copiedState, e => e.uuid_key === uuid_key); // Mutates array
        setReceivingList(copiedState);
    }

    /**
     * Determines whether line-items use cash or credit. Changes the tradeType by reference in the receivingList array
     * which changes the button color/active prop in ReceivingListItem
     */
    const activeTradeType = (uuid_key, tradeType) => {
        const previousState = [...receivingList];
        const card = previousState.find(e => e.uuid_key === uuid_key);
        card.tradeType = TRADE_TYPE[tradeType];
        setReceivingList(previousState);
    }

    /**
     * Selects all items by their tradeType, if possible
     * 
     * @param {String} tradeType - `CASH` or `CREDIT`
     */
    const selectAll = (tradeType) => {
        const oldState = [...receivingList];
        const { CASH, CREDIT } = TRADE_TYPE;

        oldState.forEach((card, idx, arr) => {
            if (card.tradeType !== tradeType) { // if the line-items tradeType is not the one passed
                const otherType = card.tradeType === CASH ? CREDIT : CASH; // determine the tradeType and set it to other one (toggle)
                const otherTypeValue = otherType === CASH ? card.cashPrice : card.creditPrice; // see what the value of the other is
                // if the other is greater than 0, we mutate array in-place
                if (otherTypeValue > 0) arr[idx].tradeType = otherType;
            }
        })

        setReceivingList(oldState);
    }

    /**
     * Persists all passed cards to inventory via Promise.all() using the addCardToInventory backend method
     */
    const commitToInventory = async () => {
        const stateWithUnremovedProps = [...receivingList];

        // Need to remove all the props we've been adding to the card objects
        // when passing them to other components for state management.
        const removedProps = stateWithUnremovedProps.map(c => {
            return _.omit(c, [
                "cashPrice",
                "creditPrice",
                "inventoryQty",
                "addToList",
                "uuid_key",
                "tradeType",
                "activeTradeType"
            ])
        })

        try {
            const promises = removedProps.map(async c => {
                return await axios.post(ADD_CARD_TO_INVENTORY, {
                    quantity: 1,
                    type: c.finishCondition,
                    cardInfo: _.omit(c, 'finishCondition') // remove `finishCondition` finally
                }, { headers: makeAuthHeader() });
            })

            await Promise.all(promises);
            setSearchResults([]);
            setReceivingList([]);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <React.Fragment>
            <SearchBar handleSearchSelect={handleSearchSelect} />
            <br />
            <Grid stackable={true}>
                <Grid.Row>
                    <Grid.Column width="10">
                        <Header as="h2" style={{ display: "inline-block" }}>Card Search</Header>
                        <Divider />
                        <DefaultPlaceholder
                            active={!searchResults.length}
                            headerText={"So many cards, so little time."}
                        />
                        <ReceivingSearchList
                            cards={searchResults}
                            addToList={addToList}
                        />
                    </Grid.Column>
                    <Grid.Column width="6">
                        <Header as="h2" style={{ display: "inline-block" }}>Buylist</Header>
                        {receivingList.length > 0 &&
                            <Header floated="right" style={{ display: "inline-block" }}>Total Cards: {receivingList.length}</Header>
                        }
                        <Divider />
                        <DefaultPlaceholder
                            active={!receivingList.length}
                            headerText={"If you receive it, they will come."}
                        />
                        {receivingList.length > 0 && <Table compact size="small">
                            <Table.Body>
                                {receivingList.map(({ name, set, rarity, cashPrice, creditPrice, finishCondition, uuid_key, tradeType }) => {
                                    return <ReceivingListItem
                                        name={name}
                                        set={set}
                                        rarity={rarity}
                                        cashPrice={cashPrice}
                                        creditPrice={creditPrice}
                                        finishCondition={finishCondition}
                                        uuid_key={uuid_key}
                                        removeFromList={removeFromList}
                                        tradeType={tradeType}
                                        activeTradeType={activeTradeType}
                                        key={uuid_key}
                                    />
                                })}
                            </Table.Body>
                        </Table>}
                        {receivingList.length > 0 && <ReceivingListTotals
                            receivingList={receivingList}
                            selectAll={selectAll}
                            commitToInventory={commitToInventory}
                        />}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </React.Fragment>
    );
}
