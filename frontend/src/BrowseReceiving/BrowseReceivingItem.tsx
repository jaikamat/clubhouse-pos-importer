import {
    Card,
    CardActionArea,
    CardContent,
    Grid,
    Typography,
} from '@material-ui/core';
import { sum } from 'lodash';
import React, { FC, useState } from 'react';
import Chip from '../common/Chip';
import { getPrice } from '../common/Price';
import { Trade } from '../context/ReceivingContext';
import MetaData from '../ui/MetaData';
import displayEmpty from '../utils/displayEmpty';
import formatDate from '../utils/formatDate';
import pluralize from '../utils/pluralize';
import BrowseReceivingListDialog from './BrowseReceivingListDialog';
import { Received } from './browseReceivingQuery';

interface Props {
    received: Received;
}

const BrowseReceivingItem: FC<Props> = ({ received }) => {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const {
        received_card_list,
        created_at,
        created_by,
        customer_name,
    } = received;

    const cashPrice = sum(
        received_card_list
            .filter((r) => r.tradeType === Trade.Cash)
            .map((r) => r.cashPrice)
    );

    const creditPrice = sum(
        received_card_list
            .filter((r) => r.tradeType === Trade.Credit)
            .map((r) => r.creditPrice)
    );

    return (
        <>
            {dialogOpen && (
                <BrowseReceivingListDialog
                    receivedId={received._id}
                    onClose={() => setDialogOpen(false)}
                />
            )}
            <Card variant="outlined">
                <CardActionArea
                    disableRipple
                    onClick={() => setDialogOpen(true)}
                >
                    <CardContent>
                        <Grid
                            container
                            spacing={2}
                            justify="space-between"
                            alignItems="center"
                        >
                            <Grid item>
                                <Typography variant="h6">
                                    {`${received_card_list.length} ${pluralize(
                                        received_card_list.length,
                                        'card'
                                    )}`}
                                </Typography>
                                <Typography color="textSecondary">
                                    <MetaData>
                                        <span>{formatDate(created_at)}</span>
                                        <span>
                                            Received by {created_by.username}
                                        </span>
                                        <span>
                                            Customer:{' '}
                                            {displayEmpty(customer_name)}
                                        </span>
                                    </MetaData>
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Chip
                                    size="small"
                                    label={`Cash: ${getPrice(cashPrice)}`}
                                    color={
                                        cashPrice > 0 ? 'primary' : undefined
                                    }
                                />
                                <Chip
                                    size="small"
                                    label={`Credit: ${getPrice(creditPrice)}`}
                                    color={
                                        creditPrice > 0 ? 'primary' : undefined
                                    }
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </CardActionArea>
            </Card>
        </>
    );
};

export default BrowseReceivingItem;
