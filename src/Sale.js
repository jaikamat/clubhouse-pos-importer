import React from 'react';
import axios from 'axios';
import { Grid, Container, Segment, Header } from 'semantic-ui-react';
import SearchBar from './SearchBar';
import BrowseCardList from './BrowseCardList';
import SaleLineItem from './SaleLineItem';
import _ from 'lodash';
import { networkInterfaces } from 'os';

export default class Sale extends React.Component {
    state = {
        searchResults: [],
        saleListCards: []
    };

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
            console.log(data);

            this.setState({ searchResults: data });
        } catch (err) {
            console.log(err);
        }
    };

    addToSaleList = (id, name, set, finishCondition, qtyToSell, price) => {
        const card = {
            id: id,
            name: name,
            set: set,
            finishCondition: finishCondition,
            qtyToSell: qtyToSell,
            price: price
        };

        const oldState = this.state.saleListCards;
        // Need to make sure same ID's with differing conditions are separate line-items
        const idx = oldState.findIndex(el => {
            return el.id === id && el.finishCondition === finishCondition;
        });

        if (idx !== -1) {
            oldState.splice(idx, 1, card);
        } else {
            oldState.push(card);
        }

        this.setState({ saleListCards: oldState });
    };

    removeFromSaleList = (id, finishCondition) => {
        const newState = _.reject([...this.state.saleListCards], el => {
            return el.id === id && el.finishCondition === finishCondition;
        });

        this.setState({
            saleListCards: newState
        });
    };

    render() {
        const { searchResults, saleListCards } = this.state;

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
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}
