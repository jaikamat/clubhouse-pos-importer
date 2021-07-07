import React, { useState, useContext, FC } from 'react';
import { Modal, Button, Form, List, Header } from 'semantic-ui-react';
import { ReceivingContext, Trade } from '../context/ReceivingContext';
import Price from '../common/Price';
import { FormikErrors, useFormik } from 'formik';
import sum from '../utils/sum';

interface Props {}

interface FormValues {
    customerName: string;
    customerContact: string;
}

const initialFormValues: FormValues = {
    customerName: '',
    customerContact: '',
};

// TODO: Extract and generalize this
const validate = ({ customerName, customerContact }: FormValues) => {
    const errors: FormikErrors<FormValues> = {};

    if (!customerName) {
        errors.customerName = 'Required';
    }

    if (customerName.length < 3) {
        errors.customerName = 'Min 3 characters';
    }

    if (customerName.length > 50) {
        errors.customerName = 'Max 50 characters';
    }

    if (customerContact.length > 50) {
        errors.customerContact = 'Max 50 characters';
    }

    return errors;
};

const ReceivingListModal: FC<Props> = () => {
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const { receivingList, commitToInventory } = useContext(ReceivingContext);

    const onSubmit = async ({ customerName, customerContact }: FormValues) => {
        setLoading(true);
        await commitToInventory(
            customerName,
            customerContact ? customerContact : null
        );
        setLoading(false);
    };

    const { handleChange, handleSubmit, errors } = useFormik({
        initialValues: initialFormValues,
        validate,
        onSubmit,
    });

    const cashTotal = sum(
        receivingList
            .filter((c) => c.tradeType === Trade.Cash)
            .map((c) => c.cashPrice || 0)
    );

    const creditTotal = sum(
        receivingList
            .filter((c) => c.tradeType === Trade.Credit)
            .map((c) => c.creditPrice || 0)
    );

    return (
        <>
            <Button
                color="blue"
                disabled={receivingList.length === 0}
                onClick={() => setShowModal(true)}
            >
                Commit to inventory
            </Button>
            {setShowModal && (
                <Modal
                    closeOnDimmerClick={false}
                    open={showModal}
                    onClose={() => setShowModal(false)}
                >
                    <Modal.Header>Receiving confirmation</Modal.Header>
                    <Modal.Content scrolling>
                        <Header as="h5">
                            Committing the following cards to inventory:
                        </Header>
                        <List>
                            {receivingList.map((c) => {
                                return (
                                    <List.Item key={c.uuid_key}>
                                        {`● ${c.name} | ${c.set_name} (
                                        ${c.set.toUpperCase()})`}
                                    </List.Item>
                                );
                            })}
                        </List>
                        <Header as="h5">The customer is owed:</Header>
                        <List>
                            {cashTotal > 0 ? (
                                <List.Item>
                                    ● <Price num={cashTotal} /> in cold, hard
                                    cash
                                </List.Item>
                            ) : null}
                            {creditTotal > 0 ? (
                                <List.Item>
                                    ● <Price num={creditTotal} /> in store
                                    credit
                                </List.Item>
                            ) : null}
                        </List>
                    </Modal.Content>
                    <Modal.Content>
                        <Form>
                            <Form.Group widths="equal">
                                <Form.Field>
                                    <label>Customer name</label>
                                    <Form.Input
                                        onChange={handleChange}
                                        name="customerName"
                                        error={errors.customerName}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Customer contact (optional)</label>
                                    <Form.Input
                                        onChange={handleChange}
                                        name="customerContact"
                                        error={errors.customerContact}
                                    />
                                </Form.Field>
                            </Form.Group>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button
                            color="blue"
                            type="submit"
                            loading={loading}
                            disabled={loading}
                            onClick={() => handleSubmit()}
                        >
                            Submit
                        </Button>
                    </Modal.Actions>
                </Modal>
            )}
        </>
    );
};

export default ReceivingListModal;
