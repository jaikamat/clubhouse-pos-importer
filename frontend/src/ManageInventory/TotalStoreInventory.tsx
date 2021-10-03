import { Box, makeStyles, Typography } from '@material-ui/core';
import React, { FC, useEffect, useState } from 'react';
import InventoryChip from '../ui/InventoryChip';
import { ClientCard } from '../utils/ClientCard';
import allLocationInventoryQuery, {
    ResponseData,
} from './allLocationInventoryQuery';

const useStyles = makeStyles(({ spacing }) => ({
    labelContainer: {
        display: 'flex',
        alignItems: 'center',
        '& > *': {
            marginLeft: spacing(2),
        },
    },
    chipContainer: {
        display: 'inline',
        '& > *': {
            display: 'inline',
        },
        '& > *:not(:last-child)': {
            paddingRight: spacing(1),
        },
    },
}));

interface Props {
    title: string;
    searchResults: ClientCard[];
}

const TotalStoreInventory: FC<Props> = ({ title, searchResults }) => {
    const { labelContainer, chipContainer } = useStyles();
    const [quantities, setQuantities] = useState<ResponseData>({
        ch1: { foilQty: 0, nonfoilQty: 0, etchedQty: 0 },
        ch2: { foilQty: 0, nonfoilQty: 0, etchedQty: 0 },
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const data = await allLocationInventoryQuery({ title });
                setQuantities(data);
                setLoading(false);
            } catch (err) {
                console.log(err);
            }
        })();
    }, [title, searchResults]);

    if (loading) {
        return (
            <div className={labelContainer}>
                <div>
                    <Typography>Beaverton totals:</Typography>
                    <Typography>Loading...</Typography>
                </div>
                <div>
                    <Typography>Hillsboro totals:</Typography>
                    <Typography>Loading...</Typography>
                </div>
            </div>
        );
    }

    const { ch1, ch2 } = quantities;

    return (
        <div className={labelContainer}>
            <div>
                <Typography>Beaverton totals:</Typography>
                <Box className={chipContainer}>
                    <InventoryChip label="Foil" quantity={ch1.foilQty} />
                    <InventoryChip label="Nonfoil" quantity={ch1.nonfoilQty} />
                    {ch1.etchedQty > 0 && (
                        <InventoryChip
                            label="Etched"
                            quantity={ch1.etchedQty}
                        />
                    )}
                </Box>
            </div>
            <div>
                <Typography>Hillsboro totals:</Typography>
                <Box className={chipContainer}>
                    <InventoryChip label="Foil" quantity={ch2.foilQty} />
                    <InventoryChip label="Nonfoil" quantity={ch2.nonfoilQty} />
                    {ch2.etchedQty > 0 && (
                        <InventoryChip
                            label="Etched"
                            quantity={ch2.etchedQty}
                        />
                    )}
                </Box>
            </div>
        </div>
    );
};

export default TotalStoreInventory;
