import {
    Box,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogContent,
    Grid,
    Paper,
    Typography,
} from '@material-ui/core';
import React, { FC, useState } from 'react';
import Price from '../common/Price';
import { Trade, useReceivingContext } from '../context/ReceivingContext';
import Button from '../ui/Button';
import sum from '../utils/sum';
import CashReport from './CashReport';
import printCashReport from './printCashReport';
import ReceivingListModal from './ReceivingListModal';

interface Props {}

const ReceivingListTotals: FC<Props> = () => {
    const { Cash, Credit } = Trade;
    const [showCashModal, setShowCashModal] = useState(false);
    const { receivingList, selectAll } = useReceivingContext();

    const openCashModal = () => setShowCashModal(true);
    const closeCashModal = () => setShowCashModal(false);

    const handlePrintCashReport = () => {
        setShowCashModal(false); // Close the modal so users don't have to after printing in new tab
        printCashReport();
    };

    const cashTotal = sum(
        receivingList
            .filter((c) => c.tradeType === Cash)
            .map((c) => c.cashPrice || 0)
    );

    const creditTotal = sum(
        receivingList
            .filter((c) => c.tradeType === Credit)
            .map((c) => c.creditPrice || 0)
    );

    return (
        <Paper variant="outlined">
            <Box p={2}>
                <Grid container spacing={2}>
                    <Grid item xs={12} justify="space-between">
                        <ButtonGroup fullWidth>
                            <Button
                                id="select-all-cash"
                                onClick={() => selectAll(Trade.Cash)}
                            >
                                Select all cash
                            </Button>
                            <Button
                                id="select-all-credit"
                                onClick={() => selectAll(Trade.Credit)}
                            >
                                Select all credit
                            </Button>
                        </ButtonGroup>
                    </Grid>
                    <Grid item xs={12}>
                        {cashTotal > 0 && (
                            <Button fullWidth onClick={openCashModal}>
                                Generate cash report
                            </Button>
                        )}
                        {showCashModal && (
                            <Dialog open maxWidth="md" fullWidth>
                                <DialogContent>
                                    <CashReport receivingList={receivingList} />
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        primary
                                        onClick={handlePrintCashReport}
                                    >
                                        Print Report
                                    </Button>
                                    <Button onClick={closeCashModal}>
                                        Cancel
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Typography>CASH DUE</Typography>

                            <Typography variant="h6">
                                <b>
                                    <Price num={cashTotal} />
                                </b>
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Typography>CREDIT DUE</Typography>

                            <Typography variant="h6">
                                <b>
                                    <Price num={creditTotal} />
                                </b>
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <ReceivingListModal />
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default ReceivingListTotals;
