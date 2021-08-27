import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
} from '@material-ui/core';
import { useFormik } from 'formik';
import React, { FC, useState } from 'react';
import ControlledSearchBar from '../ui/ControlledSearchBar';
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

    const onDialogOpen = () => setDialogOpen(true);
    const onDialogClose = () => setDialogOpen(false);

    const { handleChange, values, setFieldValue, handleSubmit } = useFormik({
        initialValues: filters,
        validate,
        onSubmit: async (v: FormValues) => {
            await onSubmit(v);
            onDialogClose();
        },
        /**
         * Formik will not update `initialValues` from externally-controlled sources (ie. props) if changed,
         * even if the component is unmounted. We have to flip this switch to initialize with updated prop values
         */
        enableReinitialize: true,
    });

    return (
        <>
            <Button
                disableElevation
                variant="contained"
                color="primary"
                onClick={onDialogOpen}
            >
                Filter
            </Button>
            {dialogOpen && (
                <Dialog open onClose={onDialogClose} maxWidth="sm" fullWidth>
                    <DialogTitle>Receiving search</DialogTitle>
                    <DialogContent>
                        <form>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <ControlledSearchBar
                                        value={values.cardName}
                                        onChange={(v) =>
                                            setFieldValue('cardName', v)
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormikNativeDatePicker
                                        label="Start date"
                                        name="startDate"
                                        defaultValue={filters.startDate}
                                        handleChange={handleChange}
                                        max={values.endDate}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormikNativeDatePicker
                                        label="End date"
                                        name="endDate"
                                        defaultValue={filters.endDate}
                                        handleChange={handleChange}
                                        max={filters.endDate}
                                    />
                                </Grid>
                            </Grid>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" onClick={onDialogClose}>
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
