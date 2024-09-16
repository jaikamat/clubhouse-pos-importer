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
import FormikNativeDatePicker from '../ui/FormikNativeDatePicker';

export interface FormValues {
    startDate: string;
    endDate: string;
}

interface Props {
    onSubmit: (v: FormValues) => void;
    filters: FormValues;
}

// TODO: Validations
const validate = () => {
    return {};
};

const ReportingFilterDialog: FC<Props> = ({ onSubmit, filters }) => {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const onDialogOpen = () => setDialogOpen(true);
    const onDialogClose = () => setDialogOpen(false);

    const { handleChange, values, handleSubmit } = useFormik({
        initialValues: filters,
        validate,
        onSubmit: async (v: FormValues) => {
            await onSubmit(v);
            onDialogClose();
        },
    });

    return (
        <>
            <Button
                disableElevation
                variant="outlined"
                color="primary"
                onClick={onDialogOpen}
            >
                Filter dates
            </Button>
            {dialogOpen && (
                <Dialog open onClose={onDialogClose} maxWidth="sm" fullWidth>
                    <DialogTitle>Choose report dates</DialogTitle>
                    <DialogContent>
                        <form>
                            <Grid container spacing={2}>
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

export default ReportingFilterDialog;
