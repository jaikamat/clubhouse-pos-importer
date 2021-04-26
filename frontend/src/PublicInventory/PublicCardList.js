import React from 'react';
import PublicCardItem from './PublicCardItem';
import { Grid } from 'semantic-ui-react';

const gridStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    alignContent: 'space-evenly',
    height: '100%'
};

export default function PublicCardList({ cards }) {
    return <Grid style={gridStyle} >
        {cards.map(c =>
            <PublicCardItem
                key={c.id}
                card={c}
            />
        )}
    </ Grid>
}
