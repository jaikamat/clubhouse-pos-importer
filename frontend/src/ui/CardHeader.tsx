import React, { FC } from 'react';
import { InventoryCard } from '../utils/ScryfallCard';
import { Label, Item, Button, Icon } from 'semantic-ui-react';
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

// TODO: remove this shim after TCG api approval and integration
const TcgPriceButton: FC<{ tcgId: number | null }> = ({ tcgId }) => {
    const tcgUrl = `https://www.tcgplayer.com/product/${tcgId}`;

    if (!tcgId) {
        return (
            <Button
                icon
                disabled
                color="twitter"
                labelPosition="right"
                size="mini"
                as="a"
                href={tcgUrl}
                target="_blank"
            >
                Link unavailable
                <Icon name="external share" />
            </Button>
        );
    }

    return (
        <Button
            icon
            color="twitter"
            labelPosition="right"
            size="mini"
            as="a"
            href={tcgUrl}
            target="_blank"
        >
            View on TCG
            <Icon name="external share" />
        </Button>
    );
};

const CardHeader: FC<Props> = ({
    card,
    selectedFinish,
    showMid = false,
    round = false,
}) => {
    const {
        id,
        display_name,
        set,
        rarity,
        set_name,
        qoh,
        lang,
        tcgplayer_id,
    } = card;

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
            <TcgPriceButton tcgId={tcgplayer_id} />
        </Item.Header>
    );
};

export default CardHeader;
