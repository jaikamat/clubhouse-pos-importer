import React, { FC, useState } from 'react';
import { Label } from 'semantic-ui-react';
import { Received } from './browseReceivingQuery';
import pluralize from '../utils/pluralize';
import formatDate from '../utils/formatDate';
import {
    Card,
    CardActionArea,
    CardHeader,
    Typography,
} from '@material-ui/core';
import ReceivingListDialog from './ReceivingListDialog';
import { sum } from 'lodash';
import { getPrice } from '../common/Price';

interface Props {
    received: Received;
}

const ReceivingListItem: FC<Props> = ({ received }) => {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const { received_card_list, employee_number, created_at } = received;

    const cashPrice = sum(received_card_list.map((r) => r.cashPrice));
    const creditPrice = sum(received_card_list.map((r) => r.creditPrice));

    return (
        <>
            {dialogOpen && (
                <ReceivingListDialog
                    receivingList={received_card_list}
                    onClose={() => setDialogOpen(false)}
                />
            )}
            <Card variant="outlined">
                <CardActionArea onClick={() => setDialogOpen(true)}>
                    <CardHeader
                        title={
                            <>
                                <Typography variant="h6" component="span">
                                    {`${received_card_list.length} ${pluralize(
                                        received_card_list.length,
                                        'card'
                                    )}`}
                                </Typography>
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
                            </>
                        }
                        subheader={
                            <>
                                <span>{formatDate(created_at)}</span>
                                <span>{' • '}</span>
                                <span>
                                    Received by employee #{employee_number}
                                </span>
                            </>
                        }
                    />
                </CardActionArea>
            </Card>
        </>
    );
};

export default ReceivingListItem;
