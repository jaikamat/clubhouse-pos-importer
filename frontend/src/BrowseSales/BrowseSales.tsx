import React, { FC, useEffect, useState } from 'react';
import BrowseSalesList from './BrowseSalesList';
import { Divider } from 'semantic-ui-react';
import browseSalesQuery, { Sale } from './browseSalesQuery';
import { HeaderText } from '../ui/Typography';
import ControlledSearchBar from '../ui/ControlledSearchBar';
import Loading from '../ui/Loading';
import { Typography } from '@material-ui/core';

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
            <ControlledSearchBar
                value={term}
                onChange={(v) => setTerm(v ? v.title : '')}
            />
            <br />
            <HeaderText>Browse Sales</HeaderText>
            <Divider />

            {loading ? (
                <Loading />
            ) : (
                <>
                    {term !== '' && (
                        <Typography>
                            {salesList.length} results for <em>{term}</em>
                        </Typography>
                    )}

                    <BrowseSalesList list={salesList} />
                </>
            )}
        </div>
    );
};

export default BrowseSales;
