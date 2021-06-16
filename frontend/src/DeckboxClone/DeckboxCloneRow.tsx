import React, { FC, useState, MouseEvent } from 'react';
import { Table, Icon } from 'semantic-ui-react';
import Price from '../common/Price';
import TooltipImage from '../common/TooltipImage';
import { FinishCondition } from '../utils/ScryfallCard';

const conditionMap = {
    NM: 'Near Mint',
    LP: 'Light Play',
    MP: 'Moderate Play',
    HP: 'Heavy Play',
};

interface Inventory {
    k: FinishCondition;
    v: number;
}

interface Props {
    inventory: Inventory;
    name: string;
    set_name: string;
    price: number;
    set: string;
    rarity: string;
    image_uri: string;
}

type Condition = keyof typeof conditionMap;

interface State {
    mouseInside: boolean;
    mouseX: number;
    mouseY: number;
}

const DeckboxCloneRow: FC<Props> = ({
    inventory,
    name,
    set_name,
    price,
    set,
    rarity,
    image_uri,
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
    const finish = inventory.k.split('_')[0];
    const condition = inventory.k.split('_')[1] as Condition;

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
                {finish === 'FOIL' && <Icon name="star" color="blue" />}
                {mouseInside && (
                    <TooltipImage image_uri={image_uri} posX={mouseX} />
                )}
            </Table.Cell>
            <Table.Cell>
                <i
                    className={`ss ss-fw ss-${set} ss-${rarity}`}
                    style={{ fontSize: '20px' }}
                />{' '}
                {set_name}
            </Table.Cell>
            <Table.Cell>{conditionMap[condition]}</Table.Cell>
            <Table.Cell>{inventory.v}</Table.Cell>
            <Table.Cell>
                <Price num={price} />
            </Table.Cell>
        </Table.Row>
    );
};

export default DeckboxCloneRow;
