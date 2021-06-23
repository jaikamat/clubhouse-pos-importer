import React, { useState, useContext, FC } from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import { ReceivingContext } from '../context/ReceivingContext';
import Price from '../common/Price';
import { Form as FormikForm, Formik } from 'formik';

interface Props {
    cashTotal: number;
    creditTotal: number;
}

interface FormValues {
    customerName: string;
    customerContact: string;
}

const initialFormValues: FormValues = {
    customerName: '',
    customerContact: '',
};

const ReceivingListModal: FC<Props> = ({ cashTotal, creditTotal }) => {
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const { receivingList, commitToInventory } = useContext(ReceivingContext);

    const onSubmit = async ({ customerName, customerContact }: FormValues) => {
        setLoading(true);
        await commitToInventory(customerName, customerContact);
        setLoading(false);
    };

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
                    >
                        {({ values, handleChange, handleSubmit }) => (
                            <>
                                <Modal.Content>
                                    <FormikForm>
                                        <pre>
                                            {JSON.stringify(values, null, 2)}
                                        </pre>
                                        <Form>
                                            <Form.Field>
                                                <label>Customer name</label>
                                                <Form.Input
                                                    onChange={handleChange}
                                                    name="customerName"
                                                />
                                            </Form.Field>
                                            <Form.Field>
                                                <label>
                                                    Customer contact (optional)
                                                </label>
                                                <Form.Input
                                                    onChange={handleChange}
                                                    name="customerContact"
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
