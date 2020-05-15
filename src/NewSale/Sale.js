import React, { useState } from 'react';
import axios from 'axios';
import _ from 'lodash';
import $ from 'jquery';
import { Grid, Segment, Header, Button, Modal, Icon, Divider } from 'semantic-ui-react';
import { GET_CARDS_BY_TITLE, FINISH_SALE, SUSPEND_SALE } from '../api_resources';
import SearchBar from '../SearchBar';
import BrowseCardList from './BrowseCardList';
import SalePriceTotal from './SalePriceTotal';
import CustomerSaleList from './CustomerSaleList';
import PrintList from './PrintList';
import makeAuthHeader from '../makeAuthHeader';
import createToast from '../createToast';
import SuspendedSale from '../SuspendedSale';
import sortSaleList from '../utils/sortSaleList';
import { InventoryCard } from '../utils/ScryfallCard';

export default function Sale() {
    const [searchResults, setSearchResults] = useState([]);
    const [saleListCards, setSaleListCards] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [submit, setSubmit] = useState({ loading: false, disabled: false });
    const [searchTerm, setSearchTerm] = useState('');
    const [suspendedSale, setSuspendedSale] = useState({
        _id: '',
        name: '',
        notes: '',
        list: []
    });

    const resetState = () => {
        setSearchResults([]);
        setSaleListCards([]);
        setShowModal(false);
        setSubmit({ loading: false, disabled: false });
        setSearchTerm('');
        setSuspendedSale({
            _id: '',
            name: '',
            notes: '',
            list: []
        })
    };

    const handleResultSelect = async term => {
        try {
            const { data } = await axios.get(GET_CARDS_BY_TITLE, {
                params: { title: term },
                headers: makeAuthHeader()
            });

            const modeledData = data.map(c => new InventoryCard(c));

            setSearchResults(modeledData);
            setSearchTerm(term);

            if (data.length === 0) { $('#searchBar').focus().select() }
        } catch (e) {
            console.log(e.response);
        }
    };

    /**
     * Adds product to the sale list
     */
    const addToSaleList = (card, finishCondition, qtyToSell, price) => {
        const newCard = { ...card, finishCondition, qtyToSell, price };
        const oldState = [...saleListCards];
        const modeledCard = new InventoryCard(newCard);

        // Need to make sure same ID's with differing conditions are separate line-items
        const idx = oldState.findIndex(el => {
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
     * Removes product from the sale list (this function is passed to the sale line items through props)
     */
    const removeFromSaleList = (id, finishCondition) => {
        const newState = _.reject([...saleListCards], el => {
            return el.id === id && el.finishCondition === finishCondition;
        });

        setSaleListCards(newState);
    };

    /**
     * Restores a sale (assigns a saleList to state) from a suspended sale from the db
     */
    const restoreSale = async (id) => {
        try {
            const { data } = await axios.get(`${SUSPEND_SALE}/${id}`);
            const modeledData = data.list.map(c => new InventoryCard(c));

            setSaleListCards(modeledData);
            setSuspendedSale(data);

            createToast({ color: 'green', header: `You are viewing ${data.name}'s sale` });
        } catch (e) {
            console.log(e.response);
            createToast({ color: 'red', header: `Error` });
        }
    }

    /**
     * Suspends a sale (persists it to mongo) via the SuspendedSale component and API
     */
    const suspendSale = async ({ customerName, notes }) => {
        const { _id } = suspendedSale;

        try {
            if (!!_id) await axios.delete(`${SUSPEND_SALE}/${_id}`); // If we're suspended, delete the previous to replace

            const { data } = await axios.post(SUSPEND_SALE, {
                customerName: customerName,
                notes: notes,
                saleList: saleListCards
            })

            resetState();

            createToast({ color: 'green', header: `${data.ops[0].name}'s sale was suspended` });
        } catch (e) {
            console.log(e.response);
            createToast({ color: 'red', header: `Error`, message: `${e.response.data}` });
        }
    }

    const deleteSuspendedSale = async () => {
        try {
            const { _id, name } = suspendedSale;
            await axios.delete(`${SUSPEND_SALE}/${_id}`);

            resetState();

            createToast({ color: 'green', header: `${name}'s sale was deleted` });
        } catch (e) {
            console.log(e.response);
            createToast({ color: 'red', header: `Error` });
        }
    }

    /**
     * Extracts the saleList state and uses it to complete sale
     */
    const finalizeSale = async () => {
        const { _id } = suspendedSale;

        try {
            setSubmit({ loading: true, disabled: true });

            // Must delete currently suspended sale to faithfully restore inventory prior to sale
            if (!!_id) await axios.delete(`${SUSPEND_SALE}/${_id}`);

            const { data } = await axios.post(FINISH_SALE, {
                cards: saleListCards.map(card => {
                    // Reconstruct the original object received from Scryfall to preserve backwards-compatibility in mongo
                    const { cachedOriginal, qtyToSell, finishCondition, price } = card;
                    return { ...cachedOriginal, qtyToSell, finishCondition, price };
                })
            }, { headers: makeAuthHeader() });

            const saleID = data.sale_data.Sale.saleID;

            createToast({
                color: 'green',
                header: 'Sale created in Lightspeed!',
                message: `The id number is #${saleID}`,
            });

            resetState();
        } catch (e) {
            createToast({
                color: 'red',
                header: 'Error',
                message: `Sale was not created`,
            });

            resetState();
            console.log(e.response);
        }
    };

    // Creates text to notify the user of zero-result searches
    const searchNotification = () => {
        if (searchTerm && !searchResults.length) { // Check to make sure the user has searched and no results
            return <p>Zero results for <em>{searchTerm}</em></p>
        }
        return <p>Search for inventory to sell</p>; // Default text before search
    }

    const modalTrigger = <Button floated="right" primary
        onClick={() => setShowModal(true)}>
        Finalize sale
        </Button>

    return (
        <React.Fragment>
            <Grid.Row style={{ display: 'flex', alignItems: 'center' }}>
                <SearchBar handleSearchSelect={handleResultSelect} />
            </Grid.Row>
            <br />
            <Grid stackable={true}>
                <Grid.Row>
                    <Grid.Column width="11">
                        <Header as="h2" style={{ display: "inline-block" }}>Inventory</Header>
                        <Divider />

                        {!searchResults.length &&
                            <Segment placeholder>
                                <Header icon>
                                    <Icon name="search" />
                                    <span>{searchNotification()}</span>
                                </Header>
                            </Segment>}

                        <BrowseCardList
                            cards={searchResults}
                            addToSaleList={addToSaleList}
                        />
                    </Grid.Column>
                    <Grid.Column width="5">
                        <Header as="h2" style={{ display: 'inline-block' }}>
                            {suspendedSale.name === '' ? 'Sale Items' : `${suspendedSale.name}'s Items`}
                        </Header>

                        <SuspendedSale
                            restoreSale={restoreSale}
                            suspendSale={suspendSale}
                            saleListLength={saleListCards.length}
                            deleteSuspendedSale={deleteSuspendedSale}
                            id={suspendedSale._id}
                        />
                        <PrintList saleListCards={saleListCards} />

                        <Divider />

                        {saleListCards.length === 0 &&
                            <Segment placeholder>
                                <Header icon>
                                    <Icon name="plus" />
                                    View and manage customer sale list here
                                </Header>
                            </Segment>}

                        {saleListCards.length > 0 && <React.Fragment>
                            <CustomerSaleList
                                removeFromSaleList={removeFromSaleList}
                                saleList={saleListCards}
                            />
                        </React.Fragment>}

                        {saleListCards.length > 0 && (
                            <Segment clearing>
                                <Header floated="left">
                                    <Header sub>Subtotal</Header>
                                    <SalePriceTotal
                                        saleList={saleListCards}
                                    />
                                </Header>
                                <Modal
                                    basic
                                    open={showModal}
                                    trigger={modalTrigger}>
                                    <Modal.Content>
                                        <Header inverted as="h2">
                                            Finalize this sale?
                                            </Header>
                                        <p>
                                            Click 'Yes' to create a sale
                                            in Lightspeed. Ensure that
                                            you have all cards pulled and double-checked
                                            the customer list. Undoing this action will require manual data entry!
                                            </p>
                                    </Modal.Content>
                                    <Modal.Actions>
                                        <Button
                                            basic
                                            color="red"
                                            inverted
                                            onClick={() => setShowModal(false)}>
                                            <Icon name="remove" /> No
                                            </Button>
                                        <Button
                                            color="green"
                                            inverted
                                            onClick={finalizeSale}
                                            loading={submit.loading}
                                            disabled={submit.disabled}>
                                            <Icon name="checkmark" /> Yes
                                            </Button>
                                    </Modal.Actions>
                                </Modal>
                            </Segment>)}
                    </Grid.Column>
                </Grid.Row >
            </Grid >
        </React.Fragment >
    );
}
