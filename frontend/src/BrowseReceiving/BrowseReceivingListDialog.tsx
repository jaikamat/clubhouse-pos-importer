import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@material-ui/core';
import React, { FC, useEffect, useState } from 'react';
import { Trade } from '../context/ReceivingContext';
import CardImageTooltip from '../ui/CardImageTooltip';
import Loading from '../ui/Loading';
import MetaData from '../ui/MetaData';
import SetIcon from '../ui/SetIcon';
import displayEmpty from '../utils/displayEmpty';
import displayFinishCondition from '../utils/finishCondition';
import formatDate from '../utils/formatDate';
import { price } from '../utils/price';
import receivedByIdQuery, { Received } from './receivedByIdQuery';

interface Props {
    receivedId: string;
    onClose: () => void;
}

function alphaSort<T extends { bulk_card_data: { name: string } }>(arr: T[]) {
    return [...arr].sort((a, b) =>
        a.bulk_card_data.name.localeCompare(b.bulk_card_data.name)
    );
}

function displayTrade(trade: Trade) {
    if (trade === Trade.Credit) return 'Credit';
    else if (trade === Trade.Cash) return 'Cash';
}

const BrowseReceivingListDialog: FC<Props> = ({ receivedId, onClose }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<Received | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const data = await receivedByIdQuery(receivedId);
                setData(data);
                setLoading(false);
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);

    if (!data || loading) {
        return (
            <Dialog open onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>Received cards</DialogTitle>
                <DialogContent>
                    <Loading />
                </DialogContent>
            </Dialog>
        );
    }

    const {
        received_cards: receivingList,
        created_at,
        created_by,
        customer_name,
        customer_contact,
    } = data;

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
                            finishCondition,
                            tradeType,
                            creditPrice,
                            cashPrice,
                            marketPrice,
                        } = card;

                        const { name, cardImage, set, set_name, rarity } =
                            card.bulk_card_data;

                        return (
                            <ListItem>
                                <ListItemText
                                    primary={
                                        <>
                                            <CardImageTooltip
                                                cardImage={cardImage}
                                            >
                                                <span
                                                    style={{ cursor: 'help' }}
                                                >
                                                    {name}{' '}
                                                </span>
                                            </CardImageTooltip>
                                            <SetIcon
                                                set={set}
                                                rarity={rarity}
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

export default BrowseReceivingListDialog;
