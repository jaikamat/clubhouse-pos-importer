import React, { FC } from 'react';
import PublicCardItem from './PublicCardItem';
import { Grid } from 'semantic-ui-react';
import { InventoryCard } from '../utils/ScryfallCard';

interface Props {
    cards: InventoryCard[];
}

const gridStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    alignContent: 'space-evenly',
    height: '100%',
};

const PublicCardList: FC<Props> = ({ cards }) => {
    return (
        <Grid style={gridStyle}>
            {cards.map((c) => (
                <PublicCardItem key={c.id} card={c} />
            ))}
        </Grid>
    );
};

export default PublicCardList;
