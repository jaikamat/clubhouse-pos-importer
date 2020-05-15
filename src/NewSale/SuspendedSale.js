import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SUSPEND_SALE } from '../utils/api_resources';
import { Modal, Button, Grid, Form, Message } from 'semantic-ui-react';
import styled from 'styled-components';

const Divider = styled.div`
    border-left: 1px solid rgba(0, 0, 0, 0.2);
    height: 100%;
`;

const ClearMargin = styled.div`
    margin-top: 0px;
    margin-bottom: 0px;
`;

const CharLimit = styled.p`
    font-size: 12px;
    color: rgba(0, 0, 0, 0.2);
    float: right;
`;

export default function SuspendedSale({ restoreSale, deleteSuspendedSale, saleListLength, suspendSale, id }) {
    const [sales, setSales] = useState([]);
    const [saleID, setSaleID] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [notes, setNotes] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [loadingBtn, setLoadingBtn] = useState({
        suspendBtn: false,
        restoreBtn: false,
        deleteBtn: false
    });

    const getSales = async () => {
        const { data } = await axios.get(SUSPEND_SALE);
        setSales(data);
    }

    const clearFields = () => {
        setCustomerName('');
        setNotes('')
        setSaleID('');
    }

    // Get the previously suspended sales on mount and parent state (_id) change
    useEffect(() => { getSales(); }, [id]); // If the parent-level suspended-sale _id changes, we fetch again

    const modalTrigger = <Button
        style={{ display: 'inline-block', float: 'right' }}
        onClick={() => setModalOpen(true)}
        icon="ellipsis horizontal" />

    const submitSuspendSale = async () => {
        setDisabled(true);
        setLoadingBtn({ suspendBtn: true });
        await suspendSale({ customerName, notes });
        setModalOpen(false); // Close the modal to avoid "flicker" when state re-renders
        await getSales(); // Parent _id does not change, re-fetch sales
        clearFields();
        setDisabled(false);
        setLoadingBtn({ suspendBtn: false });
    }

    const submitRestoreSale = async () => {
        setDisabled(true);
        setLoadingBtn({ restoreBtn: true });
        await restoreSale(saleID);
        setModalOpen(false);
        clearFields();
        setDisabled(false);
        setLoadingBtn({ restoreBtn: false });
    }

    const submitDeleteSale = async () => {
        setDisabled(true);
        setLoadingBtn({ deleteBtn: true });
        await deleteSuspendedSale();
        setModalOpen(false);
        clearFields();
        setDisabled(false);
        setLoadingBtn({ deleteBtn: false });
    }

    return <React.Fragment>
        <Modal trigger={modalTrigger} open={modalOpen}>
            <Modal.Header>Sales menu</Modal.Header>
            <Modal.Content>
                <Grid columns={2} stackable relaxed="very">
                    {saleListLength > 0 && <React.Fragment>
                        <Grid.Column width="7">
                            <h3>Suspend Sale</h3>
                            <Form>
                                <ClearMargin>
                                    <Form.Input
                                        label="Customer Name"
                                        placeholder="Jace, the Mind Sculptor"
                                        value={customerName}
                                        onChange={(e, { value }) => setCustomerName(value.substring(0, 50))} />
                                </ClearMargin>
                                <ClearMargin>
                                    <CharLimit>{customerName.length}/50</CharLimit>
                                </ClearMargin>
                                <ClearMargin>
                                    <Form.TextArea
                                        label="Notes"
                                        placeholder="Sometimes, I forget things..."
                                        value={notes}
                                        onChange={(e, { value }) => setNotes(value.substring(0, 150))} />
                                </ClearMargin>
                                <ClearMargin>
                                    <CharLimit>{notes.length}/150</CharLimit>
                                </ClearMargin>
                                <Form.Button primary disabled={disabled || !customerName} loading={loadingBtn.suspendBtn} onClick={submitSuspendSale}>Suspend Sale</Form.Button>
                            </Form>
                        </Grid.Column>
                        <Grid.Column width="1"><Divider /></Grid.Column>
                    </React.Fragment>}
                    <Grid.Column width="7">
                        <h3>Restore Sale</h3>
                        {sales.length > 0 && <React.Fragment>
                            <Form>
                                <Form.Select
                                    fluid
                                    label="Previously suspended sales"
                                    options={sales.map(s => {
                                        return {
                                            key: s._id,
                                            text: s.name,
                                            value: s._id
                                        }
                                    })}
                                    placeholder="Select a sale"
                                    onChange={(e, { value }) => setSaleID(value)}
                                />
                                <Form.Button primary disabled={disabled || !saleID} loading={loadingBtn.restoreBtn} onClick={submitRestoreSale}>Restore Sale</Form.Button>
                            </Form>
                        </React.Fragment>}
                        {sales.length === 0 && <Message info>
                            <Message.Header>No sales</Message.Header>
                            Suspend a sale first
                        </Message>}
                    </Grid.Column>
                </Grid>
            </Modal.Content>
            <Modal.Actions>
                {!!id && <Button color="red" disabled={disabled} loading={loadingBtn.deleteBtn} onClick={submitDeleteSale}>Delete current Sale</Button>}
                <Button primary disabled={disabled} onClick={() => setModalOpen(false)}>Cancel</Button>
            </Modal.Actions>
        </Modal>
    </React.Fragment >
}