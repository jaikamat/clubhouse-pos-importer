import React, { FC } from 'react';
import { Table, Icon } from 'semantic-ui-react';
import Price from '../common/Price';
import CardImageTooltip from '../ui/CardImageTooltip';
import SetIcon from '../ui/SetIcon';
import { ResponseCard } from './filteredCardsQuery';

const conditionMap = {
    NM: 'Near Mint',
    LP: 'Light Play',
    MP: 'Moderate Play',
    HP: 'Heavy Play',
};

type Condition = keyof typeof conditionMap;

interface Props {
    card: ResponseCard;
}

const BrowseInventoryRow: FC<Props> = ({
    card: {
        finishCondition,
        quantityInStock,
        name,
        set_name,
        price,
        set,
        rarity,
        image_uri,
    },
}) => {
    const finish = finishCondition.split('_')[0];
    const condition = finishCondition.split('_')[1] as Condition;

    return (
        <Table.Row>
            <Table.Cell>
                <CardImageTooltip cardImage={image_uri}>
                    <span style={{ cursor: 'help' }}>{name} </span>
                </CardImageTooltip>
                {finish === 'FOIL' && <Icon name="star" color="blue" />}
            </Table.Cell>
            <Table.Cell>
                <SetIcon set={set} rarity={rarity} />
                {set_name}
            </Table.Cell>
            <Table.Cell>{conditionMap[condition]}</Table.Cell>
            <Table.Cell>{quantityInStock}</Table.Cell>
            <Table.Cell>
                <Price num={price} />
            </Table.Cell>
        </Table.Row>
    );
};

export default BrowseInventoryRow;
