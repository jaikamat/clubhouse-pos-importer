import React, { FC, useState } from 'react';
import SearchBar from '../common/SearchBar';
import SalesList from './SalesList';
import axios from 'axios';
import makeAuthHeader from '../utils/makeAuthHeader';
import { GET_SALES_BY_TITLE } from '../utils/api_resources';
import { Header, Divider } from 'semantic-ui-react';
import { Sale } from './SalesList';

const BrowseSales: FC = () => {
    const [salesList, setSalesList] = useState<Sale[]>([]);
    const [cardName, setCardName] = useState<string>('');

    const handleSearchSelect = async (cardName: string) => {
        const { data }: { data: Sale[] } = await axios.get(GET_SALES_BY_TITLE, {
            params: { cardName: cardName },
            headers: makeAuthHeader(),
        });

        setSalesList(data);
        setCardName(cardName);
    };

    return (
        <div>
            <SearchBar handleSearchSelect={handleSearchSelect} />

            <Header as="h2">Browse Sales</Header>
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
