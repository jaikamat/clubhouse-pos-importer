import React, { useState, useContext } from 'react';
import axios from 'axios';
import $ from 'jquery';
import { Grid, Header, Divider } from 'semantic-ui-react';
import { GET_CARDS_WITH_INFO } from '../utils/api_resources';
import SearchBar from '../common/SearchBar';
import BrowseCardList from './BrowseCardList';
import CustomerSaleList from './CustomerSaleList';
import PrintList from './PrintList';
import makeAuthHeader from '../utils/makeAuthHeader';
import SuspendedSale from './SuspendedSale';
import { InventoryCard } from '../utils/ScryfallCard';
import { SaleContext } from '../context/SaleContext';

export default function Sale() {
    const {
        saleListCards,
        suspendedSale,
        restoreSale,
        deleteSuspendedSale,
        suspendSale,
        resetSaleState
    } = useContext(SaleContext);

    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const resetState = () => {
        setSearchResults([]);
        setSearchTerm('');
        resetSaleState();
    };

    const handleResultSelect = async term => {
        try {
            const { data } = await axios.get(GET_CARDS_WITH_INFO, {
                params: { title: term, matchInStock: true },
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

                        <BrowseCardList term={searchTerm} cards={searchResults} />

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

                        <CustomerSaleList saleList={saleListCards} />
                    </Grid.Column>
                </Grid.Row >
            </Grid >
        </React.Fragment >
    );
}
