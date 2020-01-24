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
import { GET_CARDS_BY_TITLE, FINISH_SALE } from './api_resources';
import createToast from './createToast';

/**
 * Takes in an unordered group of cards and sorts them according to The Clubhouse's specs:
 * WUBRG, then multicolor, then colorless, then land, alphabetically within each color/category
 */
function sortSaleList(cards) {
    const ORDER = ['W', 'U', 'B', 'R', 'G', 'MULTI', 'COLORLESS', 'LAND'];

    /**
     * Main helper function that manages sort order
     * @param {Object} card
     */
    function helpSort(card) {
        let arrayConst = null;

        let colorsLength = null;
        let cardFace = null;

        try {
            // If colors don't exist, it's a flip card or storybook frame
            colorsLength = card.colors.length;
            cardFace = card;
        } catch (e) {
            try {
                // Storybook frames from Eldraine may throw error
                colorsLength = card.card_faces[0].colors.length;
                cardFace = card.card_faces[0];
            } catch (e) {
                colorsLength = card.colors.length;
                cardFace = card;
            }
        }

        // Apply logic to return correct constant enum
        if (colorsLength === 0) {
            arrayConst = 'COLORLESS';
        } else if (colorsLength === 1) {
            arrayConst = cardFace.colors[0];
        } else if (colorsLength > 1) {
            arrayConst = 'MULTI';
        }

        // Drill into colorless cards, if they are lands or not
        if (arrayConst === 'COLORLESS') {
            if (cardFace.type_line.includes('Land')) {
                arrayConst = 'LAND';
            }
        }

        // Final check to guard against a null arrayConst
        if (!arrayConst) { arrayConst = 'LAND' }

        return arrayConst;
    }

    const alphaSort = cards.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    const sorted = alphaSort.sort((a, b) => {
        return ORDER.indexOf(helpSort(a)) - ORDER.indexOf(helpSort(b));
    });

    return sorted;
}

const initialState = {
    searchResults: [],
    saleListCards: [],
    showModal: false,
    submitLoading: false,
    searchTerm: ''
};

export default class Sale extends React.Component {
    state = initialState;

    handleResultSelect = async term => {
        try {
            const { data } = await axios.get(GET_CARDS_BY_TITLE, {
                params: { title: term },
                headers: makeAuthHeader()
            });

            this.setState({ searchResults: data, searchTerm: term });
        } catch (err) {
            console.log(err);
        }
    };

    /**
     * Adds product to the sale list
     */
    addToSaleList = (card, finishCondition, qtyToSell, price) => {
        const newCard = { ...card, finishCondition, qtyToSell, price };
        const oldState = [...this.state.saleListCards];

        // Need to make sure same ID's with differing conditions are separate line-items
        const idx = oldState.findIndex(el => {
            return (
                el.id === newCard.id && el.finishCondition === finishCondition
            );
        });

        if (idx !== -1) {
            oldState.splice(idx, 1, newCard);
        } else {
            oldState.push(newCard);
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
     * Extracts the saleList state and uses it to complete sale
     */
    finalizeSale = async () => {
        try {
            this.setState({ submitLoading: true });

            const { data } = await axios.post(FINISH_SALE, {
                cards: this.state.saleListCards
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
                header: 'Error!',
                message: `Sale was not created`,
            });

            this.setState(initialState);
            console.log(e);
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
            searchTerm
        } = this.state;

        // Creates text to notify the user of zero-result searches
        const searchNotification = () => {
            if (searchTerm && !searchResults.length) { // Check to make sure the user has searched and no results
                return <p>Zero results for <em>{searchTerm}</em></p>
            }
            return <p>Search for inventory to sell</p>; // Default text before search
        }

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
                            <Header as="h2" style={{ display: 'inline-block' }}>Sale Items</Header>

                            <PrintList saleListCards={saleListCards} />
                            <Divider />

                            {saleListCards.length === 0 &&
                                <Segment placeholder>
                                    <Header icon>
                                        <Icon name="plus" />
                                        View and manage customer sale list here
                                </Header>
                                </Segment>
                            }

                            {saleListCards.length > 0 && <React.Fragment>
                                <CustomerSaleList
                                    removeFromSaleList={this.removeFromSaleList}
                                    saleList={saleListCards}
                                />
                            </React.Fragment>
                            }

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
                                        trigger={
                                            <Button
                                                floated="right"
                                                primary
                                                onClick={() => {
                                                    this.setState({
                                                        showModal: true
                                                    });
                                                }}
                                            >
                                                Finalize sale
                                            </Button>
                                        }
                                    >
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
                                                onClick={this.closeModal}
                                            >
                                                <Icon name="remove" /> No
                                            </Button>
                                            <Button
                                                color="green"
                                                inverted
                                                onClick={this.finalizeSale}
                                                loading={submitLoading}
                                            >
                                                <Icon name="checkmark" /> Yes
                                            </Button>
                                        </Modal.Actions>
                                    </Modal>
                                </Segment>
                            )}
                        </Grid.Column>
                    </Grid.Row >
                </Grid >
            </React.Fragment >
        );
    }
}
