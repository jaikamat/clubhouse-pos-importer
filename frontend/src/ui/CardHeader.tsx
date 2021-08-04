import React, { FC } from 'react';
import { ScryfallCard } from '../utils/ScryfallCard';
import { Label, Item } from 'semantic-ui-react';
import QohLabels from '../common/QohLabels';
import Language from '../common/Language';
import MarketPrice from '../common/MarketPrice';
import { Finish } from '../utils/checkCardFinish';
import SetIcon from './SetIcon';
import Button from './Button';
import { Link } from '@material-ui/core';

interface Props {
    card: ScryfallCard;
    selectedFinish: Finish;
    showMid?: boolean;
    round?: boolean;
}

// TODO: remove this shim after TCG api approval and integration
const TcgPriceButton: FC<{ tcgId: number | null }> = ({ tcgId }) => {
    const tcgUrl = `https://www.tcgplayer.com/product/${tcgId}`;

    return (
        <Link href={tcgUrl} target="_blank">
            <Button primary disabled={!tcgId} size="small">
                {!tcgId ? 'Link unavailable' : 'View on TCG'}
            </Button>
        </Link>
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
            <SetIcon set={set} rarity={rarity} />
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
