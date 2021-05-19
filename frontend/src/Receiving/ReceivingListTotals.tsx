import React, { useState, useContext, FC } from 'react';
import { Segment, Statistic, Button, Modal } from 'semantic-ui-react';
import styled from 'styled-components';
import Price from '../common/Price';
import CashReport from './CashReport';
import printCashReport from './printCashReport';
import ReceivingListModal from './ReceivingListModal';
import { ReceivingContext, Trade } from '../context/ReceivingContext';
import sum from '../utils/sum';

interface Props {}

const FlexRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const FlexCol = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    min-height: 100px;
`;

const StatisticColor = styled(Statistic.Label)`
    color: gray !important;
`;

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
        <Segment>
            <FlexRow>
                <FlexCol>
                    <Button.Group>
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
                    <Modal
                        open={showCashModal}
                        trigger={
                            <Button
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
                </FlexCol>
                <FlexCol>
                    <Segment>
                        <div>
                            <Statistic size="mini">
                                <StatisticColor>Cash Due</StatisticColor>
                                <Statistic.Value id="cash-total">
                                    <Price num={cashTotal} />
                                </Statistic.Value>
                            </Statistic>
                            <Statistic size="mini">
                                <StatisticColor>Credit Due</StatisticColor>
                                <Statistic.Value id="credit-total">
                                    <Price num={creditTotal} />
                                </Statistic.Value>
                            </Statistic>
                        </div>
                        <ReceivingListModal
                            cashTotal={cashTotal}
                            creditTotal={creditTotal}
                        />
                    </Segment>
                </FlexCol>
            </FlexRow>
        </Segment>
    );
};

export default ReceivingListTotals;
