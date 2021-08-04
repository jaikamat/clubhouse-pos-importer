import React, { FC } from 'react';
import { Chip, makeStyles } from '@material-ui/core';
import { forwardRef } from 'react';

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

interface Props {
    label: string;
    quantity: number;
}

/**
 * We need to forward the refs from possible tooltip implementations to this custom
 * component so `Tooltip` can access and modify the underlying children
 */
const InventoryChip: FC<Props> = forwardRef<HTMLDivElement, Props>(
    (props, ref) => {
        const { quantity, label } = props;
        const quantityColor = quantity > 0 ? 'primary' : undefined;

        const { container, chip } = useStyles({
            color: quantityColor,
        });

        return (
            <div {...props} ref={ref} className={container}>
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
    }
);

export default InventoryChip;
