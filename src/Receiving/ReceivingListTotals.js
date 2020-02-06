import React, { useState } from 'react';
import { Segment, Statistic, Button, Modal, Header } from 'semantic-ui-react';
import Price from '../Price';
import CashReport from './CashReport';
import printCashReport from './printCashReport';

const TRADE_TYPE = { CASH: 'CASH', CREDIT: 'CREDIT' };

export default function ReceivingListTotals({ receivingList, selectAll, commitToInventory }) {
    const { CASH, CREDIT } = TRADE_TYPE;
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showCashModal, setShowCashModal] = useState(false);

    const openCashModal = () => setShowCashModal(true);

    const closeCashModal = () => setShowCashModal(false);

    const submitToInventory = async () => {
        setLoading(true);
        await commitToInventory();
        setLoading(false);
    }

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button.Group>
                <Button onClick={() => selectAll(TRADE_TYPE.CASH)}>Select all cash</Button>
                <Button.Or />
                <Button onClick={() => selectAll(TRADE_TYPE.CREDIT)}>Select all credit</Button>
            </Button.Group>
            <div>
                <Statistic size="mini">
                    <Statistic.Label>Cash Due:</Statistic.Label>
                    <Statistic.Value><Price num={cashTotal} /></Statistic.Value>
                </Statistic>
                <Statistic size="mini">
                    <Statistic.Label>Credit Due:</Statistic.Label>
                    <Statistic.Value><Price num={creditTotal} /></Statistic.Value>
                </Statistic>
            </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Modal id="printme"
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
                    <Button onClick={handlePrintCashReport} color="primary">Print Report</Button>
                    <Button onClick={closeCashModal}>Cancel</Button>
                </Modal.Actions>
            </Modal>

            <Modal
                closeOnDimmerClick={false}
                trigger={
                    <Button
                        color="primary"
                        disabled={receivingList.length === 0}
                        onClick={() => setShowModal(true)}>
                        Commit to inventory
                    </Button>
                }
                open={showModal}
                onClose={() => setShowModal(false)}
                basic style={{ marginTop: '50px' }} >
                <Header>Confirm receipt of new inventory?</Header>
                <Modal.Content>
                    <p><b>Pressing 'Submit' will commit the following items to inventory:</b></p>
                    <ul>
                        {receivingList.map(c => {
                            return <li key={c.uuid_key}>{c.name} | {c.set_name}({c.set.toUpperCase()})</li>
                        })}
                    </ul>
                    <div>
                        <p><b>The customer is owed: </b></p>
                        <ul>
                            {cashTotal > 0 ? <li><Price num={cashTotal} /> in cold, hard cash</li> : null}
                            {creditTotal > 0 ? <li><Price num={creditTotal} /> in store credit</li> : null}
                        </ul>
                    </div>
                </Modal.Content>
                <Modal.Actions>
                    <Button basic color="red" inverted onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button color="green" inverted loading={loading} disabled={loading} onClick={submitToInventory}>Submit</Button>
                </Modal.Actions>
            </Modal>
        </div>
    </Segment>
}