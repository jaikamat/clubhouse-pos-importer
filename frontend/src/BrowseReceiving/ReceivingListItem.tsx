import React, { FC, useState } from 'react';
import { Label } from 'semantic-ui-react';
import { Received } from './browseReceivingQuery';
import pluralize from '../utils/pluralize';
import formatDate from '../utils/formatDate';
import {
    Card,
    CardActionArea,
    CardContent,
    Grid,
    Typography,
} from '@material-ui/core';
import ReceivingListDialog from './ReceivingListDialog';
import { sum } from 'lodash';
import { getPrice } from '../common/Price';
import MetaData from '../ui/MetaData';
import { Trade } from '../context/ReceivingContext';
import displayEmpty from '../utils/displayEmpty';

interface Props {
    received: Received;
}

const ReceivingListItem: FC<Props> = ({ received }) => {
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
                <ReceivingListDialog
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
                                <Label
                                    color={cashPrice > 0 ? 'blue' : undefined}
                                    image
                                >
                                    Cash:
                                    <Label.Detail>
                                        {getPrice(cashPrice)}
                                    </Label.Detail>
                                </Label>
                                <Label
                                    color={creditPrice > 0 ? 'blue' : undefined}
                                    image
                                >
                                    Credit:
                                    <Label.Detail>
                                        {getPrice(creditPrice)}
                                    </Label.Detail>
                                </Label>
                            </Grid>
                        </Grid>
                    </CardContent>
                </CardActionArea>
            </Card>
        </>
    );
};

export default ReceivingListItem;
