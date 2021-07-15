import React, { FC, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@material-ui/core';
import { useFormik } from 'formik';
import { Form } from 'semantic-ui-react';
import FormikControlledSearchBar from '../ui/FormikControlledSearchBar';
import FormikNativeDatePicker from '../ui/FormikNativeDatePicker';

export interface FormValues {
    cardName: string;
    startDate: string;
    endDate: string;
}

interface Props {
    onSubmit: (v: FormValues) => void;
    filters: FormValues;
}

// No validations needed for now
const validate = () => {
    return {};
};

const BrowseReceivingFilterDialog: FC<Props> = ({ onSubmit, filters }) => {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const { handleChange, values, setFieldValue, handleSubmit } = useFormik({
        initialValues: filters,
        validate,
        onSubmit: async (v: FormValues) => {
            await onSubmit(v);
            setDialogOpen(false);
        },
    });

    return (
        <>
            <Button
                disableElevation
                variant="contained"
                color="primary"
                onClick={() => setDialogOpen(true)}
            >
                Filter
            </Button>
            {dialogOpen && (
                <Dialog
                    open
                    onClose={() => setDialogOpen(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Receiving search</DialogTitle>
                    <DialogContent>
                        <Form>
                            <FormikControlledSearchBar
                                label="Card name"
                                value={values.cardName}
                                onChange={(v) => setFieldValue('cardName', v)}
                            />
                            <FormikNativeDatePicker
                                label="Start date"
                                name="startDate"
                                defaultValue={filters.startDate}
                                handleChange={handleChange}
                                max={values.endDate}
                            />
                            <FormikNativeDatePicker
                                label="End date"
                                name="endDate"
                                defaultValue={filters.endDate}
                                handleChange={handleChange}
                                max={filters.endDate}
                            />
                        </Form>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="outlined"
                            onClick={() => setDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            disableElevation
                            variant="contained"
                            color="primary"
                            onClick={() => handleSubmit()}
                        >
                            Search
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
};

export default BrowseReceivingFilterDialog;
