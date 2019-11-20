import React from 'react';
import axios from 'axios';
import { Grid, Segment, Header, Button, Modal, Icon } from 'semantic-ui-react';
import SearchBar from './SearchBar';
import BrowseCardList from './BrowseCardList';
import SaleLineItem from './SaleLineItem';
import _ from 'lodash';

const initialState = {
    searchResults: [],
    saleListCards: [],
    showModal: false
};

export default class Sale extends React.Component {
    state = initialState;

    handleResultSelect = async term => {
        try {
            const { data } = await axios.get(
                `https://us-central1-clubhouse-collection.cloudfunctions.net/getCardsByTitle`,
                {
                    params: {
                        title: term
                    }
                }
            );

            this.setState({ searchResults: data });
        } catch (err) {
            console.log(err);
        }
    };

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

        this.setState({ saleListCards: oldState });
    };

    removeFromSaleList = (id, finishCondition) => {
        const newState = _.reject([...this.state.saleListCards], el => {
            return el.id === id && el.finishCondition === finishCondition;
        });

        this.setState({ saleListCards: newState });
    };

    finalizeSale = () => {
        console.log(this.state.saleListCards);
        console.log('Finalized Sale! Wohoo!');

        this.setState(initialState);
    };

    closeModal = () => {
        this.setState({ showModal: false });
    };

    render() {
        const { searchResults, saleListCards, showModal } = this.state;

        const list = saleListCards.map(c => {
            return (
                <SaleLineItem
                    {...c}
                    key={`${c.id}${c.finishCondition}${c.qtyToSell}`}
                    deleteLineItem={this.removeFromSaleList}
                />
            );
        });

        return (
            <div>
                <SearchBar handleSearchSelect={this.handleResultSelect} />
                <Grid>
                    <Grid.Row>
                        <Grid.Column width="10">
                            <Header as="h2">Inventory</Header>
                            <Segment>
                                <BrowseCardList
                                    cards={searchResults}
                                    addToSaleList={this.addToSaleList}
                                />
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width="6">
                            <Header as="h2">Sale Items</Header>
                            <Segment>
                                <Segment.Group>{list}</Segment.Group>
                            </Segment>
                            {saleListCards.length > 0 && (
                                <Modal
                                    open={showModal}
                                    trigger={
                                        <Button
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
                                    basic
                                >
                                    <Modal.Content>
                                        <Header inverted as="h2">
                                            Finalize this sale for Lightspeed?
                                        </Header>
                                        <p>
                                            Click 'Yes' to complete the sale in
                                            Lightspeed. Undoing this action will
                                            be quite painful
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
                                        >
                                            <Icon name="checkmark" /> Yes
                                        </Button>
                                    </Modal.Actions>
                                </Modal>
                            )}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}
