import React, { FC } from 'react';
import SaleSearchCard from './SaleSearchCard';
import { Segment, Header, Icon } from 'semantic-ui-react';
import { ScryfallCard } from '../utils/ScryfallCard';
import { Grid } from '@material-ui/core';
import Loading from '../ui/Loading';

interface Props {
    loading: boolean;
    term: string;
    cards: ScryfallCard[];
}

const BrowseCardList: FC<Props> = ({ loading, term, cards }) => {
    // Creates text to notify the user of zero-result searches
    const searchNotification = () => {
        if (term && !cards.length) {
            // Check to make sure the user has searched and no results
            return (
                <p>
                    Zero results for <em>{term}</em>
                </p>
            );
        }
        return (
            <p>
                <em>"Don't give the people what they want"</em>
            </p>
        );
    };

    if (loading) {
        return <Loading />;
    }

    if (cards.length === 0) {
        return (
            <Segment placeholder>
                <Header icon>
                    <Icon name="search" />
                    <span>{searchNotification()}</span>
                </Header>
            </Segment>
        );
    }

    return (
        <Grid container spacing={2}>
            {cards.map((card) => {
                return (
                    <Grid item xs={12} key={card.id}>
                        <SaleSearchCard card={card} />
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default BrowseCardList;
