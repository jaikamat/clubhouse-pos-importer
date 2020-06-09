import React, { useState, useContext } from 'react';
import { Modal, Header, Button } from 'semantic-ui-react';
import { ReceivingContext } from '../context/ReceivingContext';
import Price from '../common/Price';

export default function ReceivingListModal({ cashTotal, creditTotal }) {
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const { receivingList, commitToInventory } = useContext(ReceivingContext);

    const submitToInventory = async () => {
        setLoading(true);
        await commitToInventory();
        setLoading(false);
    }

    return <Modal
        closeOnDimmerClick={false}
        trigger={
            <Button
                color="blue"
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
}