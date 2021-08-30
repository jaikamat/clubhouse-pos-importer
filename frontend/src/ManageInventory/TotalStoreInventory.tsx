import { Box, makeStyles, Typography } from '@material-ui/core';
import React, { FC, useEffect, useState } from 'react';
import InventoryChip from '../ui/InventoryChip';
import { ScryfallCard } from '../utils/ScryfallCard';
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
        '& > *:first-child': {
            paddingRight: spacing(1),
        },
    },
}));

interface Props {
    title: string;
    searchResults: ScryfallCard[];
}

const TotalStoreInventory: FC<Props> = ({ title, searchResults }) => {
    const { labelContainer, chipContainer } = useStyles();
    const [quantities, setQuantities] = useState<ResponseData>({
        ch1: { foilQty: 0, nonfoilQty: 0 },
        ch2: { foilQty: 0, nonfoilQty: 0 },
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

    return (
        <div className={labelContainer}>
            <div>
                <Typography>Beaverton totals:</Typography>
                <Box className={chipContainer}>
                    <InventoryChip
                        label="Foil"
                        quantity={quantities.ch1.foilQty}
                    />
                    <InventoryChip
                        label="Nonfoil"
                        quantity={quantities.ch1.nonfoilQty}
                    />
                </Box>
            </div>
            <div>
                <Typography>Hillsboro totals:</Typography>
                <Box className={chipContainer}>
                    <InventoryChip
                        label="Foil"
                        quantity={quantities.ch2.foilQty}
                    />
                    <InventoryChip
                        label="Nonfoil"
                        quantity={quantities.ch2.nonfoilQty}
                    />
                </Box>
            </div>
        </div>
    );
};

export default TotalStoreInventory;
