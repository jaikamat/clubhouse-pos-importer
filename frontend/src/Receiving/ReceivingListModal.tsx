import React, { useState, useContext, FC } from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import { ReceivingContext, Trade } from '../context/ReceivingContext';
import Price from '../common/Price';
import { Form as FormikForm, Formik } from 'formik';
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
    const errors: Partial<Record<keyof FormValues, string>> = {};

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
        await commitToInventory(customerName, customerContact);
        setLoading(false);
    };

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
                    style={{ marginTop: '50px' }}
                >
                    <Modal.Header>Receiving confirmation</Modal.Header>
                    <Modal.Content>
                        <p>
                            <b>
                                Pressing 'Submit' will commit the following
                                items to inventory:
                            </b>
                        </p>
                        <ul>
                            {receivingList.map((c) => {
                                return (
                                    <li key={c.uuid_key}>
                                        {c.name} | {c.set_name}(
                                        {c.set.toUpperCase()})
                                    </li>
                                );
                            })}
                        </ul>
                        <div>
                            <p>
                                <b>The customer is owed: </b>
                            </p>
                            <ul>
                                {cashTotal > 0 ? (
                                    <li>
                                        <Price num={cashTotal} /> in cold, hard
                                        cash
                                    </li>
                                ) : null}
                                {creditTotal > 0 ? (
                                    <li>
                                        <Price num={creditTotal} /> in store
                                        credit
                                    </li>
                                ) : null}
                            </ul>
                        </div>
                    </Modal.Content>
                    <Formik
                        initialValues={initialFormValues}
                        onSubmit={onSubmit}
                        validate={validate}
                    >
                        {({ handleChange, handleSubmit, errors }) => (
                            <>
                                <Modal.Content>
                                    <FormikForm>
                                        <Form>
                                            <Form.Field>
                                                <label>Customer name</label>
                                                <Form.Input
                                                    onChange={handleChange}
                                                    name="customerName"
                                                    error={errors.customerName}
                                                />
                                            </Form.Field>
                                            <Form.Field>
                                                <label>
                                                    Customer contact (optional)
                                                </label>
                                                <Form.Input
                                                    onChange={handleChange}
                                                    name="customerContact"
                                                    error={
                                                        errors.customerContact
                                                    }
                                                />
                                            </Form.Field>
                                        </Form>
                                    </FormikForm>
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
                            </>
                        )}
                    </Formik>
                </Modal>
            )}
        </>
    );
};

export default ReceivingListModal;
