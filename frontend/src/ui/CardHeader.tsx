import React, { FC } from 'react';
import { InventoryCard } from '../utils/ScryfallCard';
import { Label, Item } from 'semantic-ui-react';
import QohLabels from '../common/QohLabels';
import Language from '../common/Language';
import MarketPrice from '../common/MarketPrice';
import { Finish } from '../utils/checkCardFinish';
import styled from 'styled-components';

interface Props {
    card: InventoryCard;
    selectedFinish: Finish;
    showMid?: boolean;
    round?: boolean;
}

const SetIcon = styled('i')({
    fontSize: '30px',
});

const CardHeader: FC<Props> = ({
    card,
    selectedFinish,
    showMid = false,
    round = false,
}) => {
    const { id, display_name, set, rarity, set_name, qoh, lang } = card;

    return (
        <Item.Header as="h3">
            {display_name}
            <SetIcon className={`ss ss-fw ss-${set} ss-${rarity}`} />
            <Label color="grey">
                {set_name} ({set.toUpperCase()})
            </Label>
            <QohLabels inventoryQty={qoh} />
            <MarketPrice
                id={id}
                finish={selectedFinish}
                showMid={showMid}
                round={round}
            />
            <Language languageCode={lang} />
        </Item.Header>
    );
};

export default CardHeader;
