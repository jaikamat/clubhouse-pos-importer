import { Box, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React, { FC, useState } from 'react';

interface Props {
    image: string;
    width: number;
    hover?: boolean;
}

const useStyles = makeStyles(({ zIndex, palette }) => ({
    imageStyle: {
        boxShadow: '2px 2px 5px 0 rgba(0,0,0,.25)',
        zIndex: zIndex.appBar,
        transition: 'all .2s ease-in-out',
        maxWidth: '100%',
        maxHeight: '100%',
    },
    hoveredStyle: {
        transform: 'scale(1.75)',
    },
    placeholderImage: {
        background: `repeating-linear-gradient(
            45deg,
            ${palette.grey[200]},
            ${palette.grey[200]} 10px,
            ${palette.grey[300]} 10px,
            ${palette.grey[300]} 20px
          )`,
        borderRadius: 10,
        height: 280,
        width: 200,
    },
}));

const CardImage: FC<Props> = ({ image, hover, width }) => {
    const { imageStyle, hoveredStyle } = useStyles();
    const [hovered, setHovered] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    const onHover = (val: boolean) => {
        if (!hover) return;
        setHovered(val);
    };

    return (
        <Box width={width}>
            <img
                onLoad={() => setIsLoaded(true)}
                alt="card-surface"
                src={image}
                className={clsx(imageStyle, {
                    [hoveredStyle]: hovered,
                })}
                onMouseOver={() => onHover(true)}
                onMouseOut={() => onHover(false)}
            />
        </Box>
    );
};

export default CardImage;
