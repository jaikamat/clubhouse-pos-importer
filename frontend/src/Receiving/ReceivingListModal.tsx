import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Typography,
} from '@material-ui/core';
import { FormikErrors, useFormik } from 'formik';
import React, { FC, useState } from 'react';
import Price from '../common/Price';
import { Trade, useReceivingContext } from '../context/ReceivingContext';
import Button from '../ui/Button';
import TextField from '../ui/TextField';
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

    const { receivingList, commitToInventory } = useReceivingContext();

    const onSubmit = async ({ customerName, customerContact }: FormValues) => {
        setLoading(true);
        await commitToInventory(
            customerName,
            customerContact ? customerContact : null
        );
        setLoading(false);
    };

    const { handleChange, handleSubmit, errors, resetForm } = useFormik({
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
                primary
                fullWidth
                disabled={receivingList.length === 0}
                onClick={() => setShowModal(true)}
            >
                Commit to inventory
            </Button>
            {showModal && (
                <Dialog
                    maxWidth="md"
                    fullWidth
                    open
                    onClose={() => setShowModal(false)}
                >
                    <DialogTitle>Receiving confirmation</DialogTitle>
                    <DialogContent>
                        <Typography variant="h5">
                            Committing the following cards to inventory:
                        </Typography>
                        <ul>
                            {receivingList.map((c) => {
                                return (
                                    <li key={c.uuid_key}>
                                        {`${c.name} | ${
                                            c.set_name
                                        } (${c.set.toUpperCase()})`}
                                    </li>
                                );
                            })}
                        </ul>
                        <Typography variant="h5">
                            The customer is owed:
                        </Typography>
                        <ul>
                            {cashTotal > 0 ? (
                                <li>
                                    <Price num={cashTotal} /> in cold, hard cash
                                </li>
                            ) : null}
                            {creditTotal > 0 ? (
                                <li>
                                    <Price num={creditTotal} /> in store credit
                                </li>
                            ) : null}
                        </ul>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Customer name"
                                    name="customerName"
                                    onChange={handleChange}
                                    error={errors.customerName}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Customer contact (optional)"
                                    name="customerContact"
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                resetForm();
                                setShowModal(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            primary
                            type="submit"
                            disabled={loading}
                            onClick={() => handleSubmit()}
                        >
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
};

export default ReceivingListModal;
