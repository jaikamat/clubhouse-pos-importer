import React, { FC, useEffect, useState } from 'react';
import BrowseSalesList from './BrowseSalesList';
import browseSalesQuery, { Sale } from './browseSalesQuery';
import { HeaderText } from '../ui/Typography';
import Loading from '../ui/Loading';
import { Grid, Typography, Divider, Box } from '@material-ui/core';
import ControlledSearchBar from '../ui/ControlledSearchBar';

const BrowseSales: FC = () => {
    const [term, setTerm] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [salesList, setSalesList] = useState<Sale[]>([]);

    const handleSearchSelect = async (cardName: string) => {
        const sales = await browseSalesQuery({ cardName });
        setSalesList(sales);
    };

    useEffect(() => {
        if (term) {
            (async () => {
                setLoading(true);
                await handleSearchSelect(term);
                setLoading(false);
            })();
        }
    }, [term]);

    return (
        <div>
            <Grid container>
                <Grid item xs={12} md={4}>
                    <ControlledSearchBar
                        value={term}
                        onChange={(v) => setTerm(v)}
                    />
                </Grid>
            </Grid>
            <br />
            <HeaderText>Browse Sales</HeaderText>
            <Divider />

            {loading ? (
                <Loading />
            ) : (
                <>
                    <Box py={2}>
                        {term !== '' && (
                            <Typography>
                                {salesList.length} results for <em>{term}</em>
                            </Typography>
                        )}
                    </Box>
                    <BrowseSalesList list={salesList} />
                </>
            )}
        </div>
    );
};

export default BrowseSales;
