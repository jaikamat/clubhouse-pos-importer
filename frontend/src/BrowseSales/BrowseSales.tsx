import React, { FC, useState } from 'react';
import SearchBar from '../common/SearchBar';
import SalesList from './SalesList';
import { Divider } from 'semantic-ui-react';
import browseSalesQuery, { Sale } from './browseSalesQuery';
import { HeaderText } from '../ui/Typography';

const BrowseSales: FC = () => {
    const [salesList, setSalesList] = useState<Sale[]>([]);
    const [cardName, setCardName] = useState<string>('');

    const handleSearchSelect = async (cardName: string) => {
        const sales = await browseSalesQuery({ cardName });

        setSalesList(sales);
        setCardName(cardName);
    };

    return (
        <div>
            <SearchBar handleSearchSelect={handleSearchSelect} />
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
