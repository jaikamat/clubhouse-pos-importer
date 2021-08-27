import { Box, Link, Typography, withStyles } from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import React, { FC } from 'react';
import MarketPrice from '../common/MarketPrice';
import QohLabels from '../common/QohLabels';
import { Finish } from '../common/types';
import language from '../utils/Language';
import { ScryfallCard } from '../utils/ScryfallCard';
import Button from './Button';
import SetIcon from './SetIcon';

interface Props {
    card: ScryfallCard;
    selectedFinish: Finish;
    showMid?: boolean;
    round?: boolean;
}

// TODO: remove this shim after TCG api approval and integration
const TcgPriceButton: FC<{ tcgId: number | null }> = ({ tcgId }) => {
    const tcgUrl = `https://www.tcgplayer.com/product/${tcgId}`;

    if (!tcgId) {
        return (
            <Button disabled size="small">
                TCG Link unavailable
            </Button>
        );
    }

    return (
        <Link href={tcgUrl} target="_blank" underline="none">
            <Button size="small">
                View on TCG <OpenInNewIcon fontSize="small" />
            </Button>
        </Link>
    );
};

const SubheaderContainer = withStyles(({ spacing }) => ({
    root: {
        '& > div': {
            marginRight: spacing(1),
        },
    },
}))(Box);

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
                <Typography variant="body2">
                    {set_name} ({set.toUpperCase()}) - {language(lang)}
                </Typography>
                <QohLabels inventoryQty={qoh} />
                <MarketPrice
                    id={id}
                    finish={selectedFinish}
                    showMid={showMid}
                    round={round}
                />
                <TcgPriceButton tcgId={tcgplayer_id} />
            </SubheaderContainer>
        </Box>
    );
};

export default CardHeader;
