import React, { useState, useContext, FC } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import Price from '../common/Price';
import CashReport from './CashReport';
import printCashReport from './printCashReport';
import ReceivingListModal from './ReceivingListModal';
import { ReceivingContext, Trade } from '../context/ReceivingContext';
import sum from '../utils/sum';
import { Box, Grid, Paper, Typography } from '@material-ui/core';

interface Props {}

const ReceivingListTotals: FC<Props> = () => {
    const { Cash, Credit } = Trade;
    const [showCashModal, setShowCashModal] = useState(false);
    const { receivingList, selectAll } = useContext(ReceivingContext);

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
                        <Button.Group fluid>
                            <Button
                                id="select-all-cash"
                                onClick={() => selectAll(Trade.Cash)}
                            >
                                Select all cash
                            </Button>
                            <Button.Or />
                            <Button
                                id="select-all-credit"
                                onClick={() => selectAll(Trade.Credit)}
                            >
                                Select all credit
                            </Button>
                        </Button.Group>
                    </Grid>
                    <Grid item xs={12}>
                        <Modal
                            open={showCashModal}
                            trigger={
                                <Button
                                    floated="right"
                                    color={cashTotal > 0 ? 'green' : undefined}
                                    disabled={cashTotal === 0}
                                    onClick={openCashModal}
                                >
                                    Generate cash report
                                </Button>
                            }
                        >
                            <Modal.Content>
                                <CashReport receivingList={receivingList} />
                            </Modal.Content>
                            <Modal.Actions>
                                <Button
                                    onClick={handlePrintCashReport}
                                    color="blue"
                                >
                                    Print Report
                                </Button>
                                <Button onClick={closeCashModal}>Cancel</Button>
                            </Modal.Actions>
                        </Modal>
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
