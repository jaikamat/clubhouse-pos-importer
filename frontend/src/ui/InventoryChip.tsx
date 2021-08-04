import React, { FC } from 'react';
import { Chip, makeStyles } from '@material-ui/core';
import { forwardRef } from 'react';

const useStyles = makeStyles({
    container: {
        display: 'inline-block',
        borderRadius: 5,
    },
    chip: {
        borderRadius: 5,
    },
    leftChip: {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
    },
    rightChip: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
    },
});

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
        const { container, leftChip, rightChip } = useStyles();
        const quantityColor = quantity > 0 ? 'primary' : undefined;

        return (
            <div {...props} ref={ref} className={container}>
                <Chip
                    color={quantityColor}
                    className={leftChip}
                    size="small"
                    label={label}
                />
                <Chip
                    color={quantityColor}
                    className={rightChip}
                    size="small"
                    label={quantity}
                />
            </div>
        );
    }
);

export default InventoryChip;
