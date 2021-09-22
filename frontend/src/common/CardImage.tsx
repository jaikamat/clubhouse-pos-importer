import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React, { FC, useState } from 'react';

interface Props {
    image: string;
    hover?: boolean;
}

const useStyles = makeStyles(({ zIndex }) => ({
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
}));

const CardImage: FC<Props> = ({ image, hover }) => {
    const { imageStyle, hoveredStyle } = useStyles();
    const [hovered, setHovered] = useState<boolean>(false);

    const onHover = (val: boolean) => {
        if (!hover) return;
        setHovered(val);
    };

    return (
        <img
            alt="card-surface"
            src={image}
            className={clsx(imageStyle, {
                [hoveredStyle]: hovered,
            })}
            onMouseOver={() => onHover(true)}
            onMouseOut={() => onHover(false)}
        />
    );
};

export default CardImage;
