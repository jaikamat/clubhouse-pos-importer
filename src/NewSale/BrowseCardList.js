import React from 'react';
import BrowseCardItem from './BrowseCardItem';
import { Segment, Header, Icon } from 'semantic-ui-react';

export default function BrowseCardList({ term, cards }) {
    // Creates text to notify the user of zero-result searches
    const searchNotification = () => {
        if (term && !cards.length) { // Check to make sure the user has searched and no results
            return <p>Zero results for <em>{term}</em></p>
        }
        return <p>Search for inventory to sell</p>
    }

    if (cards.length === 0) {
        return <Segment placeholder>
            <Header icon>
                <Icon name="search" />
                <span>{searchNotification()}</span>
            </Header>
        </Segment>
    }

    return cards.map(card => {
        return <BrowseCardItem
            key={card.id}
            {...card}
            qoh={card.qoh}
        />
    });
}
