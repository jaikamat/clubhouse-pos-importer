import React, { FC } from 'react';
import pluralize from '../utils/pluralize';
import Chip from './Chip';

interface Props {
    listLength: number;
}

const TotalCardsLabel: FC<Props> = ({ listLength }) => {
    if (listLength === 0) return null;

    return (
        <Chip
            label={`${listLength} ${pluralize(listLength, 'card')}`}
            size="small"
        />
    );
};

export default TotalCardsLabel;
