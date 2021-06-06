import React, { FC, useState } from 'react';
import SearchBar from '../common/SearchBar';
import { Header, Divider } from 'semantic-ui-react';

const BrowseReceiving: FC = () => {
    // const [salesList, setSalesList] = useState<Sale[]>([]);
    const [cardName, setCardName] = useState<string>('');

    // const handleSearchSelect = async (cardName: string) => {
    //     const sales = await browseSalesQuery({ cardName });

    //     setSalesList(sales);
    //     setCardName(cardName);
    // };

    return (
        <div>
            {/* <SearchBar handleSearchSelect={handleSearchSelect} /> */}

            <Header as="h2">Browse Receiving</Header>
            <Divider />

            <span>
                <em>Testing, 123!</em>
            </span>
            {/* <SalesList list={salesList} /> */}
        </div>
    );
};

export default BrowseReceiving;
