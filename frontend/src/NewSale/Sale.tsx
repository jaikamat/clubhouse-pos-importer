import React, { useContext, FC } from 'react';
import { Grid, Header, Divider } from 'semantic-ui-react';
import SearchBar from '../common/SearchBar';
import BrowseCardList from './BrowseCardList';
import CustomerSaleList from './CustomerSaleList';
import PrintList from './PrintList';
import SuspendSales from './SuspendedSale';
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
        searchTerm,
        searchResults,
        handleResultSelect,
        suspendedSale,
        restoreSale,
        deleteSuspendedSale,
        suspendSale,
    } = useContext(SaleContext);

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
                                <SuspendSales
                                    restoreSale={restoreSale}
                                    suspendSale={suspendSale}
                                    saleListLength={saleListCards.length}
                                    deleteSuspendedSale={deleteSuspendedSale}
                                    id={suspendedSale._id}
                                />
                                {saleListCards.length > 0 && (
                                    <PrintList saleListCards={saleListCards} />
                                )}
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
