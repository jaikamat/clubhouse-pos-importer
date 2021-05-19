import React, { useState, useContext, FC } from 'react';
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
import { InventoryCard, ScryfallApiCard } from '../utils/ScryfallCard';
import { SaleContext } from '../context/SaleContext';
import TotalCardsLabel from '../common/TotalCardsLabel';
import AllLocationInventory from '../ManageInventory/AllLocationInventory';
import styled from 'styled-components';
import sum from '../utils/sum';

interface Props {}

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

const Sale: FC<Props> = () => {
    const {
        saleListCards,
        suspendedSale,
        restoreSale,
        deleteSuspendedSale,
        suspendSale,
    } = useContext(SaleContext);

    const [searchResults, setSearchResults] = useState<InventoryCard[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const handleResultSelect = async (term: string) => {
        try {
            const { data }: { data: ScryfallApiCard[] } = await axios.get(
                GET_CARDS_WITH_INFO,
                {
                    params: { title: term, matchInStock: true },
                    headers: makeAuthHeader(),
                }
            );

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
                                    searchResults={searchResults}
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
                                    listLength={sum(
                                        saleListCards.map((c) => c.qtyToSell)
                                    )}
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
};

export default Sale;
