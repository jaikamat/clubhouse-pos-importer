import React from 'react';
import axios from 'axios';
import toaster from 'toasted-notes';
import {
    Grid,
    Segment,
    Header,
    Button,
    Modal,
    Icon,
    Message
} from 'semantic-ui-react';
import SearchBar from './SearchBar';
import BrowseCardList from './BrowseCardList';
import SaleLineItem from './SaleLineItem';
import SalePriceTotal from './SalePriceTotal';
import _ from 'lodash';
import { GET_CARDS_BY_TITLE, FINISH_SALE } from './api_resources';

const initialState = {
    searchResults: [],
    saleListCards: [],
    showModal: false,
    submitLoading: false
};

export default class Sale extends React.Component {
    state = initialState;

    handleResultSelect = async term => {
        try {
            const { data } = await axios.get(GET_CARDS_BY_TITLE, {
                params: {
                    title: term
                }
            });

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

    finalizeSale = async () => {
        try {
            this.setState({ submitLoading: true });

            const { data } = await axios.post(FINISH_SALE, {
                cards: this.state.saleListCards
            });

            const saleID = data.sale_data.Sale.saleID;

            const toastjsx = (
                <Message positive compact>
                    <Message.Header>Sale created in Lightspeed!</Message.Header>
                    The id number is #{saleID}
                </Message>
            );

            toaster.notify(() => toastjsx, {
                position: 'bottom-right'
            });

            this.setState(initialState);
        } catch (e) {
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
            submitLoading
        } = this.state;

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
                            <Segment>{list}</Segment>
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
                                                Finalize this sale for
                                                Lightspeed?
                                            </Header>
                                            <p>
                                                Click 'Yes' to complete the sale
                                                in Lightspeed. Undoing this
                                                action will be quite painful
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
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}
