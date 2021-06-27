import { makeStyles, Tooltip } from '@material-ui/core';
import { FC } from 'react';
import { Image } from 'semantic-ui-react';

interface Props {
    cardImage: string;
}

const useStyles = makeStyles({
    transparentBackground: {
        backgroundColor: 'transparent',
    },
    borderRounded: {
        borderRadius: '7px 7px 7px 7px',
    },
});

const CardImageTooltip: FC<Props> = ({ cardImage, children }) => {
    const { transparentBackground, borderRounded } = useStyles();

    return (
        <Tooltip
            placement="bottom-start"
            title={
                <Image className={borderRounded} size="small" src={cardImage} />
            }
            classes={{
                tooltip: transparentBackground,
            }}
        >
            <span>{children}</span>
        </Tooltip>
    );
};

export default CardImageTooltip;
