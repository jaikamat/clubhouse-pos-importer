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
}));

interface Props {
    title: string;
    searchResults: ScryfallCard[];
}

const TotalStoreInventory: FC<Props> = ({ title, searchResults }) => {
    const { labelContainer } = useStyles();
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
                    <Typography variant="body2">
                        <b>Loading totals for all locations</b>
                    </Typography>
                    <div>
                        <span>Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={labelContainer}>
            <div>
                <Typography variant="body2">
                    <b>Beaverton totals:</b>
                </Typography>
                <Box display="inline">
                    <Box display="inline" pr={1}>
                        <InventoryChip
                            label="Foil"
                            quantity={quantities.ch1.foilQty}
                        />
                    </Box>
                    <InventoryChip
                        label="Nonfoil"
                        quantity={quantities.ch1.nonfoilQty}
                    />
                </Box>
            </div>
            <div>
                <Typography variant="body2">
                    <b>Hillsboro totals:</b>
                </Typography>
                <Box display="inline">
                    <Box display="inline" pr={1}>
                        <InventoryChip
                            label="Foil"
                            quantity={quantities.ch2.foilQty}
                        />
                    </Box>
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
