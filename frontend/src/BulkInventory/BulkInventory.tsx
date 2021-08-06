import { Container, Grid } from '@material-ui/core';
import React, { FC } from 'react';
import { useState } from 'react';
import CardImage from '../common/CardImage';
import { BulkCard } from './bulkInventoryQuery';
import BulkSearchBar from './BulkSearchBar';

const BulkInventory: FC = () => {
    const [bulkCard, setBulkCard] = useState<BulkCard | null>(null);
    const [currentCardImage, setCurrentCardImage] = useState<string>('');

    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <BulkSearchBar
                        value={bulkCard}
                        onChange={(v) => setBulkCard(v)}
                        onHighlight={(o) => setCurrentCardImage(o?.image || '')}
                    />
                </Grid>
                <Grid item xs={6}>
                    <div>
                        <CardImage image={currentCardImage} />
                    </div>
                </Grid>
            </Grid>
        </Container>
    );
};

export default BulkInventory;
