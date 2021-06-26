import { Tooltip, withStyles } from '@material-ui/core';
import { FC } from 'react';
import TooltipImage from '../common/TooltipImage';
import { ScryfallCard } from '../utils/ScryfallCard';

interface Props {
    card: ScryfallCard;
}

const StyledTooltip = withStyles({
    tooltip: {
        backgroundColor: 'transparent',
    },
})(Tooltip);

const CardImageTitle: FC<Props> = ({ card }) => {
    const { cardImage, name } = card;

    return (
        <StyledTooltip title={<TooltipImage image_uri={cardImage} />}>
            <span style={{ cursor: 'help' }}>{name} </span>
        </StyledTooltip>
    );
};

export default CardImageTitle;
