import React from 'react';
import axios from 'axios';
import {
    Grid,
    Segment,
    Header,
    Button,
    Modal,
    Icon,
    Divider
} from 'semantic-ui-react';
import SearchBar from './SearchBar';
import BrowseCardList from './BrowseCardList';
import SalePriceTotal from './SalePriceTotal';
import CustomerSaleList from './CustomerSaleList';
import PrintList from './PrintList';
import _ from 'lodash';
import makeAuthHeader from './makeAuthHeader';
import { GET_CARDS_BY_TITLE, FINISH_SALE, SUSPEND_SALE } from './api_resources';
import createToast from './createToast';
import sortSaleList from './utils/sortSaleList';
import SuspendedSale from './SuspendedSale';
import $ from 'jquery';
import { InventoryCard } from './utils/ScryfallCard';

const initialState = {
    searchResults: [],
    saleListCards: [],
    showModal: false,
    submitLoading: false,
    submitDisabled: false,
    searchTerm: '',
    suspendedSale: {
        _id: '',
        name: '',
        notes: '',
        list: []
    }
};

export default class Sale extends React.Component {
    state = initialState;

    handleResultSelect = async term => {
        try {
            const { data } = await axios.get(GET_CARDS_BY_TITLE, {
                params: { title: term },
                headers: makeAuthHeader()
            });

            const modeledData = data.map(c => new InventoryCard(c));

            this.setState({ searchResults: modeledData, searchTerm: term });

            if (data.length === 0) { $('#searchBar').focus().select() }
        } catch (e) {
            console.log(e.response);
        }
    };

    /**
     * Adds product to the sale list
     */
    addToSaleList = (card, finishCondition, qtyToSell, price) => {
        const newCard = { ...card, finishCondition, qtyToSell, price };
        const oldState = [...this.state.saleListCards];
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

        this.setState({ saleListCards: sortedCards });
    };

    /**
     * Removes product from the sale list (this function is passed to the sale line items through props)
     */
    removeFromSaleList = (id, finishCondition) => {
        const newState = _.reject([...this.state.saleListCards], el => {
            return el.id === id && el.finishCondition === finishCondition;
        });

        this.setState({ saleListCards: newState });
    };

    /**
     * Restores a sale (assigns a saleList to state) from a suspended sale from the db
     */
    restoreSale = async (id) => {
        try {
            const { data } = await axios.get(`${SUSPEND_SALE}/${id}`);
            this.setState({
                saleListCards: data.list.map(c => new InventoryCard(c)),
                suspendedSale: data
            });

            createToast({ color: 'green', header: `You are viewing ${data.name}'s sale` });
        } catch (e) {
            console.log(e.response);
            createToast({ color: 'red', header: `Error` });
        }
    }

    /**
     * Suspends a sale (persists it to mongo) via the SuspendedSale component and API
     */
    suspendSale = async ({ customerName, notes }) => {
        const { _id } = this.state.suspendedSale;

        try {
            if (!!_id) await axios.delete(`${SUSPEND_SALE}/${_id}`); // If we're suspended, delete the previous to replace

            const { data } = await axios.post(SUSPEND_SALE, {
                customerName: customerName,
                notes: notes,
                saleList: this.state.saleListCards
            })

            this.setState(initialState);
            createToast({ color: 'green', header: `${data.ops[0].name}'s sale was suspended` });
        } catch (e) {
            console.log(e.response);
            createToast({ color: 'red', header: `Error`, message: `${e.response.data}` });
        }
    }

    deleteSuspendedSale = async () => {
        try {
            const { _id, name } = this.state.suspendedSale;
            await axios.delete(`${SUSPEND_SALE}/${_id}`);

            this.setState(initialState);

            createToast({ color: 'green', header: `${name}'s sale was deleted` });
        } catch (e) {
            console.log(e.response);
            createToast({ color: 'red', header: `Error` });
        }
    }

    /**
     * Extracts the saleList state and uses it to complete sale
     */
    finalizeSale = async () => {
        const { _id } = this.state.suspendedSale;

        try {
            this.setState({ submitLoading: true, submitDisabled: true });

            // Must delete currently suspended sale to faithfully restore inventory prior to sale
            if (!!_id) await axios.delete(`${SUSPEND_SALE}/${_id}`);

            const { data } = await axios.post(FINISH_SALE, {
                cards: this.state.saleListCards.map(card => {
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

            this.setState(initialState);
        } catch (e) {
            createToast({
                color: 'red',
                header: 'Error',
                message: `Sale was not created`,
            });

            this.setState(initialState);
            console.log(e.response);
        }
    };

    closeModal = () => {
        this.setState({ showModal: false });
    };

    render() {
        const {
            searchResults,
            saleListCards,
            showModal,
            submitLoading,
            submitDisabled,
            searchTerm,
            suspendedSale
        } = this.state;

        // Creates text to notify the user of zero-result searches
        const searchNotification = () => {
            if (searchTerm && !searchResults.length) { // Check to make sure the user has searched and no results
                return <p>Zero results for <em>{searchTerm}</em></p>
            }
            return <p>Search for inventory to sell</p>; // Default text before search
        }

        const modalTrigger = <Button floated="right" primary
            onClick={() => this.setState({ showModal: true })}>
            Finalize sale
        </Button>

        return (
            <React.Fragment>
                <Grid.Row style={{ display: 'flex', alignItems: 'center' }}>
                    <SearchBar handleSearchSelect={this.handleResultSelect} />
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
                                addToSaleList={this.addToSaleList}
                            />
                        </Grid.Column>
                        <Grid.Column width="5">
                            <Header as="h2" style={{ display: 'inline-block' }}>
                                {suspendedSale.name === '' ? 'Sale Items' : `${suspendedSale.name}'s Items`}
                            </Header>

                            <SuspendedSale
                                restoreSale={this.restoreSale}
                                suspendSale={this.suspendSale}
                                saleListLength={saleListCards.length}
                                deleteSuspendedSale={this.deleteSuspendedSale}
                                id={this.state.suspendedSale._id}
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
                                    removeFromSaleList={this.removeFromSaleList}
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
                                                onClick={this.closeModal}>
                                                <Icon name="remove" /> No
                                            </Button>
                                            <Button
                                                color="green"
                                                inverted
                                                onClick={this.finalizeSale}
                                                loading={submitLoading}
                                                disabled={submitDisabled}>
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
}
