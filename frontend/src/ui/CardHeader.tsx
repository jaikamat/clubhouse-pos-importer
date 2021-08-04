import React, { FC } from 'react';
import { ScryfallCard } from '../utils/ScryfallCard';
import QohLabels from '../common/QohLabels';
import MarketPrice from '../common/MarketPrice';
import { Finish } from '../utils/checkCardFinish';
import SetIcon from './SetIcon';
import Button from './Button';
import { Box, Link, Typography, withStyles } from '@material-ui/core';
import Chip from '../common/Chip';
import language from '../utils/Language';

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

const SubheaderContainer = withStyles({
    '& div': {
        marginRight: 5,
    },
})(Box);

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
        <Box>
            <Box display="flex" alignItems="center">
                <Typography variant="h6">
                    <b>{display_name}</b>
                </Typography>
                <SetIcon set={set} rarity={rarity} />
            </Box>
            <SubheaderContainer>
                <Chip
                    size="small"
                    label={`${set_name} (${set.toUpperCase()})`}
                />
                <QohLabels inventoryQty={qoh} />
                <MarketPrice
                    id={id}
                    finish={selectedFinish}
                    showMid={showMid}
                    round={round}
                />
                <Chip size="small" label={`${language(lang)}`} />
                <TcgPriceButton tcgId={tcgplayer_id} />
            </SubheaderContainer>
        </Box>
    );
};

export default CardHeader;
