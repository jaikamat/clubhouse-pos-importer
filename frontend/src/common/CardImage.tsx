import { Box, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React, { FC, useState } from 'react';
import placeholder from '../assets/placeholder.png';
import useImageLoaded from './useImageLoaded';

interface Props {
    source: string;
    width: number;
    hover?: boolean;
}

const useStyles = makeStyles(({ zIndex }) => ({
    imageStyle: {
        boxShadow: '2px 2px 5px 0 rgba(0,0,0,.25)',
        zIndex: zIndex.appBar,
        transition: 'all .2s ease-in-out',
        maxWidth: '100%',
        maxHeight: '100%',
        borderRadius: 10,
    },
    hoveredStyle: {
        transform: 'scale(1.75)',
    },
}));

const CardImage: FC<Props> = ({ source, hover, width }) => {
    const { imageStyle, hoveredStyle } = useStyles();
    const [hovered, setHovered] = useState<boolean>(false);
    const [ref, loaded, onLoad] = useImageLoaded();

    const onHover = (val: boolean) => {
        if (!hover) return;
        setHovered(val);
    };

    if (!source) {
        return (
            <Box width={width}>
                <img
                    alt="card-not-loaded"
                    src={placeholder}
                    className={imageStyle}
                />
            </Box>
        );
    }

    return (
        <Box width={width}>
            {!loaded && (
                <img
                    alt="card-surface"
                    src={placeholder}
                    className={imageStyle}
                />
            )}
            <img
                style={{ display: loaded ? 'inline' : 'none' }}
                ref={ref}
                onLoad={onLoad}
                alt="card-surface"
                src={source}
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
