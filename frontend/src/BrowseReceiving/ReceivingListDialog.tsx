import React, { FC } from 'react';
import { Trade } from '../context/ReceivingContext';
import displayFinishCondition from '../utils/finishCondition';
import { price } from '../utils/price';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    Button,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@material-ui/core';
import { Received } from './browseReceivingQuery';
import MetaData from '../ui/MetaData';
import formatDate from '../utils/formatDate';
import displayEmpty from '../utils/displayEmpty';

interface Props {
    received: Received;
    onClose: () => void;
}

function alphaSort<T extends { name: string }>(arr: T[]) {
    return [...arr].sort((a, b) => a.name.localeCompare(b.name));
}

function displayTrade(trade: Trade) {
    if (trade === Trade.Credit) return 'Credit';
    else if (trade === Trade.Cash) return 'Cash';
}

const ReceivingListDialog: FC<Props> = ({ received, onClose }) => {
    const {
        received_card_list: receivingList,
        created_at,
        created_by,
        customer_name,
        customer_contact,
    } = received;

    return (
        <Dialog open onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Received cards
                <Typography color="textSecondary">
                    <MetaData>
                        <span>{formatDate(created_at)}</span>
                        <span>Received by {created_by.username}</span>
                        <span>Customer: {displayEmpty(customer_name)}</span>
                        <span>
                            Customer contact: {displayEmpty(customer_contact)}
                        </span>
                    </MetaData>
                </Typography>
            </DialogTitle>
            <DialogContent>
                <List>
                    {alphaSort(receivingList).map((card) => {
                        const {
                            name,
                            set,
                            set_name,
                            finishCondition,
                            tradeType,
                            creditPrice,
                            cashPrice,
                            marketPrice,
                        } = card;

                        return (
                            <ListItem>
                                <ListItemText
                                    primary={
                                        <>
                                            <span>{name}</span>
                                            <i
                                                className={`ss ss-fw ss-${set}`}
                                                style={{
                                                    fontSize: '20px',
                                                }}
                                            />
                                            <span>({set_name})</span>
                                        </>
                                    }
                                    secondary={
                                        <MetaData>
                                            <span>
                                                {displayFinishCondition(
                                                    finishCondition
                                                )}
                                            </span>
                                            <span>
                                                {displayTrade(tradeType)}
                                            </span>
                                            {tradeType === Trade.Credit && (
                                                <span>
                                                    Credit price:{' '}
                                                    {price(creditPrice)}
                                                </span>
                                            )}
                                            {tradeType === Trade.Cash && (
                                                <>
                                                    <span>
                                                        Cash price:{' '}
                                                        {price(cashPrice)}
                                                    </span>
                                                    <span>
                                                        Market price:{' '}
                                                        {price(marketPrice)}
                                                    </span>
                                                </>
                                            )}
                                        </MetaData>
                                    }
                                />
                            </ListItem>
                        );
                    })}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="outlined" color="primary">
                    Dismiss
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReceivingListDialog;
