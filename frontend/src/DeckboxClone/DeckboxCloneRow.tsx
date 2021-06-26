import React, { FC, useState, MouseEvent } from 'react';
import { Table, Icon } from 'semantic-ui-react';
import Price from '../common/Price';
import TooltipImage from '../common/TooltipImage';
import SetIcon from '../ui/SetIcon';
import { ResponseCard } from './filteredCardsQuery';

const conditionMap = {
    NM: 'Near Mint',
    LP: 'Light Play',
    MP: 'Moderate Play',
    HP: 'Heavy Play',
};

type Condition = keyof typeof conditionMap;

interface State {
    mouseInside: boolean;
    mouseX: number;
    mouseY: number;
}

interface Props {
    card: ResponseCard;
}

const DeckboxCloneRow: FC<Props> = ({
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
    const [state, setState] = useState<State>({
        mouseInside: false,
        mouseX: 0,
        mouseY: 0,
    });

    const mouseEnter = (e: MouseEvent<HTMLElement>) => {
        const element = e.target as HTMLElement;
        if (!element) return;
        const mouseX = e.clientX - element.offsetLeft;
        const mouseY = e.clientY - element.offsetTop;
        setState({ ...state, mouseInside: true, mouseX, mouseY });
    };

    const mouseLeave = (e: MouseEvent<HTMLElement>) =>
        setState({ ...state, mouseInside: false });

    const mouseMove = (e: MouseEvent<HTMLElement>) => {
        const element = e.target as HTMLElement;
        if (!element) return;
        const mouseX = e.clientX - element.offsetLeft;
        const mouseY = e.clientY - element.offsetTop;
        setState({ ...state, mouseX, mouseY });
    };

    const { mouseInside, mouseX } = state;
    const finish = finishCondition.split('_')[0];
    const condition = finishCondition.split('_')[1] as Condition;

    return (
        <Table.Row>
            <Table.Cell>
                <span
                    onMouseEnter={mouseEnter}
                    onMouseLeave={mouseLeave}
                    onMouseMove={mouseMove}
                    style={{ cursor: 'help' }}
                >
                    {name}{' '}
                </span>
                {mouseInside && (
                    <TooltipImage image_uri={image_uri} posX={mouseX} />
                )}
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

export default DeckboxCloneRow;
