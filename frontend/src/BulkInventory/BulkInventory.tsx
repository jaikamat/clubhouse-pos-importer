import { Container } from '@material-ui/core';
import React, { FC } from 'react';
import { useState } from 'react';
import { BulkCard } from './bulkInventoryQuery';
import BulkSearchBar from './BulkSearchBar';

const BulkInventory: FC = () => {
    const [bulkCard, setBulkCard] = useState<BulkCard | null>(null);

    return (
        <Container>
            {/* <pre>{JSON.stringify(bulkCard, null, 2)}</pre> */}
            <BulkSearchBar
                value={bulkCard ? bulkCard.name : ''}
                onChange={(v) => setBulkCard(v)}
            />
            <div>this is some content</div>
        </Container>
    );
};

export default BulkInventory;
