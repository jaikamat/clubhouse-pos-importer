import { makeStyles, Tooltip } from '@material-ui/core';
import clsx from 'clsx';
import { FC } from 'react';

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
    imageSize: {
        width: 155,
        height: 'auto',
    },
});

const CardImageTooltip: FC<Props> = ({ cardImage, children }) => {
    const { transparentBackground, borderRounded, imageSize } = useStyles();

    return (
        <Tooltip
            placement="bottom-start"
            title={
                <img
                    className={clsx(borderRounded, imageSize)}
                    src={cardImage}
                />
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
