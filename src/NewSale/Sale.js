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
import TotalCardsLabel, { findSaleCardsQty } from '../common/TotalCardsLabel';
import AllLocationInventory from '../ManageInventory/AllLocationInventory';
import styled from 'styled-components';

const HeaderContainer = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
});

const ButtonContainer = styled('div')({
    display: 'flex',
    '& > *': {
        marginLeft: '10px',
    },
});

export default function Sale() {
    const {
        saleListCards,
        suspendedSale,
        restoreSale,
        deleteSuspendedSale,
        suspendSale,
    } = useContext(SaleContext);

    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const handleResultSelect = async (term) => {
        try {
            const { data } = await axios.get(GET_CARDS_WITH_INFO, {
                params: { title: term, matchInStock: true },
                headers: makeAuthHeader(),
            });

            const modeledData = data.map((c) => new InventoryCard(c));

            setSearchResults(modeledData);
            setSearchTerm(term);

            if (data.length === 0) {
                $('#searchBar').focus().select();
            }
        } catch (e) {
            console.log(e.response);
        }
    };

    return (
        <>
            <SearchBar handleSearchSelect={handleResultSelect} />
            <br />
            <Grid stackable={true}>
                <Grid.Row>
                    <Grid.Column width="11">
                        <HeaderContainer>
                            <Header as="h2">Inventory</Header>
                            {searchResults.length > 0 && (
                                <AllLocationInventory
                                    resultSet={searchResults}
                                    title={searchResults[0].name}
                                />
                            )}
                        </HeaderContainer>

                        <Divider />

                        <BrowseCardList
                            term={searchTerm}
                            cards={searchResults}
                        />
                    </Grid.Column>
                    <Grid.Column width="5">
                        <HeaderContainer>
                            <Header as="h2" id="sale-header">
                                {suspendedSale.name === ''
                                    ? 'Sale Items'
                                    : `${suspendedSale.name}'s Items`}
                                <TotalCardsLabel
                                    listLength={findSaleCardsQty(saleListCards)}
                                />
                            </Header>
                            <ButtonContainer>
                                <SuspendedSale
                                    restoreSale={restoreSale}
                                    suspendSale={suspendSale}
                                    saleListLength={saleListCards.length}
                                    deleteSuspendedSale={deleteSuspendedSale}
                                    id={suspendedSale._id}
                                />
                                <PrintList saleListCards={saleListCards} />
                            </ButtonContainer>
                        </HeaderContainer>

                        <Divider />

                        <CustomerSaleList saleList={saleListCards} />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </>
    );
}
