import React, { FC } from 'react';
import SaleSearchCard from './SaleSearchCard';
import { ScryfallCard } from '../utils/ScryfallCard';
import { Grid } from '@material-ui/core';
import Loading from '../ui/Loading';
import SearchIcon from '@material-ui/icons/Search';
import Placeholder from '../ui/Placeholder';

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
            <Placeholder icon={<SearchIcon style={{ fontSize: 80 }} />}>
                <span>{searchNotification()}</span>
            </Placeholder>
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
