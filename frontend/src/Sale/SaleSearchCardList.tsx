import { Grid } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import React, { FC } from 'react';
import Loading from '../ui/Loading';
import Placeholder from '../ui/Placeholder';
import { ScryfallCard } from '../utils/ScryfallCard';
import SaleSearchCard from './SaleSearchCard';

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
                <>
                    Zero results for <em>{term}</em>
                </>
            );
        }
        return (
            <>
                <em>"Don't give the people what they want"</em>
            </>
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
