import React, { FC } from 'react';
import { Label } from 'semantic-ui-react';
import pluralize from '../utils/pluralize';

interface Props {
    listLength: number;
}

const TotalCardsLabel: FC<Props> = ({ listLength }) => {
    if (listLength === 0) return null;

    return (
        <div>
            <Label color="grey">
                {listLength} {pluralize(listLength, 'card')}
            </Label>
        </div>
    );
};

export default TotalCardsLabel;
