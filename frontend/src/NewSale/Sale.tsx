import React, { useContext, FC } from 'react';
import { Header, Divider } from 'semantic-ui-react';
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
import { Grid } from '@material-ui/core';

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
            <Grid container spacing={2}>
                <Grid item xs={12} lg={8}>
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
                    <BrowseCardList term={searchTerm} cards={searchResults} />
                </Grid>
                <Grid item xs={12} lg={4}>
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
                </Grid>
            </Grid>
        </>
    );
};

export default Sale;
