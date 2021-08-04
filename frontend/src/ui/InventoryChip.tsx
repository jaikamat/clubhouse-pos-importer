import React, { FC } from 'react';
import { Chip, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ palette }) => ({
    container: {
        backgroundColor: ({ color }: { color?: 'primary' }) => {
            if (color === 'primary') return palette.primary.main;
            else return palette.grey[300];
        },
        display: 'inline-block',
        borderRadius: 5,
    },
    chip: {
        borderRadius: 5,
    },
}));

const InventoryChip: FC<{
    label: string;
    quantity: number;
}> = ({ label, quantity }) => {
    const quantityColor = quantity > 0 ? 'primary' : undefined;

    const { container, chip } = useStyles({
        color: quantityColor,
    });

    return (
        <div className={container}>
            <Chip
                color={quantityColor}
                className={chip}
                size="small"
                label={label}
            />
            <Chip
                color={quantityColor}
                className={chip}
                size="small"
                label={quantity}
            />
        </div>
    );
};

export default InventoryChip;
