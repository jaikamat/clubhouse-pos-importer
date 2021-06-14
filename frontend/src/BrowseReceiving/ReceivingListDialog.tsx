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
} from '@material-ui/core';
import { ReceivedCard } from './browseReceivingQuery';

interface Props {
    receivingList: ReceivedCard[];
    onClose: () => void;
}

function alphaSort<T extends { name: string }>(arr: T[]) {
    return [...arr].sort((a, b) => a.name.localeCompare(b.name));
}

function displayTrade(trade: Trade) {
    if (trade === Trade.Credit) return 'Credit';
    else if (trade === Trade.Cash) return 'Cash';
}

const ReceivingListDialog: FC<Props> = ({ receivingList, onClose }) => {
    return (
        <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Received cards</DialogTitle>
            <DialogContent>
                <List>
                    {alphaSort(receivingList).map((c) => {
                        return (
                            <ListItem>
                                <ListItemText
                                    primary={
                                        <>
                                            <span>{c.name}</span>
                                            <i
                                                className={`ss ss-fw ss-${c.set}`}
                                                style={{
                                                    fontSize: '20px',
                                                }}
                                            />
                                            <span>({c.set_name})</span>
                                        </>
                                    }
                                    secondary={
                                        <>
                                            <span>
                                                {`${displayFinishCondition(
                                                    c.finishCondition
                                                )} | ${displayTrade(
                                                    c.tradeType
                                                )}`}
                                            </span>
                                            {c.tradeType === Trade.Credit && (
                                                <span>
                                                    {` | Credit price: ${price(
                                                        c.creditPrice
                                                    )}`}
                                                </span>
                                            )}
                                            {c.tradeType === Trade.Cash && (
                                                <span>
                                                    {` | Cash price: ${price(
                                                        c.cashPrice
                                                    )} | Market price: ${price(
                                                        c.marketPrice
                                                    )}`}
                                                </span>
                                            )}
                                        </>
                                    }
                                ></ListItemText>
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
