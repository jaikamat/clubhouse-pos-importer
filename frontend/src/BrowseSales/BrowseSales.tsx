import React, { FC, useEffect, useState } from 'react';
import SalesList from './SalesList';
import { Divider } from 'semantic-ui-react';
import browseSalesQuery, { Sale } from './browseSalesQuery';
import { HeaderText } from '../ui/Typography';
import ControlledSearchBar from '../common/ControlledSearchBar';

const BrowseSales: FC = () => {
    const [term, setTerm] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [salesList, setSalesList] = useState<Sale[]>([]);
    const [cardName, setCardName] = useState<string>('');

    const handleSearchSelect = async (cardName: string) => {
        const sales = await browseSalesQuery({ cardName });

        setSalesList(sales);
        setCardName(cardName);
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
            <ControlledSearchBar value={term} onChange={(v) => setTerm(v)} />
            <br />
            <HeaderText>Browse Sales</HeaderText>
            <Divider />

            <span>
                <em>
                    {cardName !== '' && (
                        <h4>
                            {salesList.length} results for {cardName}
                        </h4>
                    )}
                </em>
            </span>
            <SalesList list={salesList} />
        </div>
    );
};

export default BrowseSales;
