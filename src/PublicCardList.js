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
    const cardList = props.cards.map(card => {
        return (
            <PublicCardItem
                key={card.id}
                {...card}
                addToSaleList={props.addToSaleList}
            />
        );
    });

    return (
        <Grid style={gridStyle} >
            {cardList}
        </ Grid>
    );
}
