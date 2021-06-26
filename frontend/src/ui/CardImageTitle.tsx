import { makeStyles, Tooltip } from '@material-ui/core';
import { FC } from 'react';
import TooltipImage from '../common/TooltipImage';

interface Props {
    cardImage: string;
}

const useStyles = makeStyles({
    transparentBackground: {
        backgroundColor: 'transparent',
    },
});

const CardImageTitle: FC<Props> = ({ cardImage, children }) => {
    const { transparentBackground } = useStyles();

    return (
        <Tooltip
            placement="bottom-start"
            title={<TooltipImage image_uri={cardImage} />}
            classes={{
                tooltip: transparentBackground,
            }}
        >
            <span>{children}</span>
        </Tooltip>
    );
};

export default CardImageTitle;
