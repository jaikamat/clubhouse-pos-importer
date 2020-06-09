import React, { useState, useContext } from 'react';
import { Segment, Statistic, Button, Modal } from 'semantic-ui-react';
import styled from 'styled-components';
import Price from '../common/Price';
import CashReport from './CashReport';
import printCashReport from './printCashReport';
import ReceivingListModal from './ReceivingListModal';
import { ReceivingContext } from '../context/ReceivingContext';

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

const TRADE_TYPE = { CASH: 'CASH', CREDIT: 'CREDIT' };

export default function ReceivingListTotals() {
    const { CASH, CREDIT } = TRADE_TYPE;
    const [showCashModal, setShowCashModal] = useState(false);
    const { receivingList, selectAll } = useContext(ReceivingContext);

    const openCashModal = () => setShowCashModal(true);
    const closeCashModal = () => setShowCashModal(false);

    const handlePrintCashReport = () => {
        setShowCashModal(false); // Close the modal so users don't have to after printing in new tab
        printCashReport();
    }

    const cashTotal = receivingList.reduce((acc, curr) => {
        let cashVal = curr.tradeType === CASH ? curr.cashPrice : 0;
        return acc + cashVal;
    }, 0);

    const creditTotal = receivingList.reduce((acc, curr) => {
        let creditVal = curr.tradeType === CREDIT ? curr.creditPrice : 0;
        return acc + creditVal;
    }, 0);

    return <Segment>
        <FlexRow>
            <FlexCol>
                <Button.Group>
                    <Button id="select-all-cash" onClick={() => selectAll(TRADE_TYPE.CASH)}>Select all cash</Button>
                    <Button.Or />
                    <Button id="select-all-credit" onClick={() => selectAll(TRADE_TYPE.CREDIT)}>Select all credit</Button>
                </Button.Group>
                <Modal
                    open={showCashModal}
                    trigger={
                        <Button
                            color={cashTotal > 0 ? 'green' : null}
                            disabled={cashTotal === 0}
                            onClick={openCashModal}>
                            Generate cash report
                    </Button>
                    }>
                    <Modal.Content>
                        <CashReport
                            receivingList={receivingList}
                            closeCashModal={closeCashModal} />
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={handlePrintCashReport} color="blue">Print Report</Button>
                        <Button onClick={closeCashModal}>Cancel</Button>
                    </Modal.Actions>
                </Modal>
            </FlexCol>
            <FlexCol>
                <Segment>
                    <div>
                        <Statistic size="mini">
                            <StatisticColor>Cash Due</StatisticColor>
                            <Statistic.Value id="cash-total"><Price num={cashTotal} /></Statistic.Value>
                        </Statistic>
                        <Statistic size="mini">
                            <StatisticColor>Credit Due</StatisticColor>
                            <Statistic.Value id="credit-total"><Price num={creditTotal} /></Statistic.Value>
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
}