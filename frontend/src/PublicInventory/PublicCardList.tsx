import React, { FC } from 'react';
import PublicCardItem from './PublicCardItem';
import { InventoryCard } from '../utils/ScryfallCard';
import styled from 'styled-components';

interface Props {
    cards: InventoryCard[];
}

const GridContainer = styled('div')({
    display: 'grid',
    gridGap: '10px',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    justifyItems: 'center',
});

const PublicCardList: FC<Props> = ({ cards }) => {
    return (
        <GridContainer>
            {cards.map((c) => (
                <PublicCardItem key={c.id} card={c} />
            ))}
        </GridContainer>
    );
};

export default PublicCardList;
