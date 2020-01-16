import React from 'react';
import PublicCardItem from './PublicCardItem';
import { Grid } from 'semantic-ui-react';

const gridStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    alignContent: 'space-evenly',
    height: '100%'
};

export default function PublicCardList(props) {
    const { cards, addToSaleList } = props;

    return (
        <Grid style={gridStyle} >
            {cards.map(card => {
                return (
                    <PublicCardItem
                        key={card.id}
                        {...card}
                        addToSaleList={addToSaleList}
                    />
                );
            })}
        </ Grid>
    );
}
