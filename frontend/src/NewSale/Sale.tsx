import React, { useContext, FC, useState, useEffect } from 'react';
import { Divider } from 'semantic-ui-react';
import BrowseCardList from './BrowseCardList';
import CustomerSaleList from './CustomerSaleList';
import PrintList from './PrintList';
import SuspendSales from './SuspendedSale';
import { SaleContext } from '../context/SaleContext';
import TotalCardsLabel from '../common/TotalCardsLabel';
import AllLocationInventory from '../ManageInventory/AllLocationInventory';
import sum from '../utils/sum';
import { Box, Grid } from '@material-ui/core';
import { HeaderText } from '../ui/Typography';
import ControlledSearchBar from '../common/ControlledSearchBar';

interface Props {}

const Sale: FC<Props> = () => {
    const [term, setTerm] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
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

    useEffect(() => {
        if (term) {
            (async () => {
                setLoading(true);
                await handleResultSelect(term);
                setLoading(false);
            })();
        }
    }, [term]);

    return (
        <>
            <ControlledSearchBar value={term} onChange={(v) => setTerm(v)} />
            <br />
            <Grid container spacing={2}>
                <Grid item xs={12} lg={8}>
                    <Grid container justify="space-between">
                        <HeaderText>Inventory</HeaderText>
                        {searchResults.length > 0 && (
                            <AllLocationInventory
                                searchResults={searchResults}
                                title={searchResults[0].name}
                            />
                        )}
                    </Grid>
                    <Divider />
                    <BrowseCardList
                        loading={loading}
                        term={searchTerm}
                        cards={searchResults}
                    />
                </Grid>
                <Grid item xs={12} lg={4}>
                    <Grid container justify="space-between">
                        <Box display="flex" alignItems="center">
                            <HeaderText>
                                {suspendedSale.name === ''
                                    ? 'Sale Items'
                                    : `${suspendedSale.name}'s Items`}
                            </HeaderText>
                            <TotalCardsLabel
                                listLength={sum(
                                    saleListCards.map((c) => c.qtyToSell)
                                )}
                            />
                        </Box>
                        <Box display="flex">
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
                        </Box>
                    </Grid>
                    <Divider />
                    <CustomerSaleList saleList={saleListCards} />
                </Grid>
            </Grid>
        </>
    );
};

export default Sale;
