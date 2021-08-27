import { Box, Container, makeStyles, Paper } from '@material-ui/core';
import { FormikErrors, useFormik } from 'formik';
import React from 'react';
import { Redirect } from 'react-router-dom';
import createToast from '../common/createToast';
import { ClubhouseLocation, useAuthContext } from '../context/AuthProvider';
import Button from '../ui/Button';
import ControlledDropdown from '../ui/ControlledDropdown';
import TextField from '../ui/TextField';

interface FormValues {
    username: string;
    password: string;
    location: ClubhouseLocation | null;
}

const initialFormValues: FormValues = {
    username: '',
    password: '',
    location: null,
};

const useStyles = makeStyles(({ spacing }) => ({
    formGap: {
        '& > *:not(:last-child)': {
            paddingBottom: spacing(2),
        },
    },
}));

const locationDropdownOptions = [
    {
        key: 'beaverton',
        text: 'Beaverton',
        value: 'ch1',
    },
    {
        key: 'hillsboro',
        text: 'Hillsboro',
        value: 'ch2',
    },
];

const validate = ({ username, password, location }: FormValues) => {
    const errors: FormikErrors<FormValues> = {};

    if (!username) {
        errors.username = 'Required';
    }

    if (!password) {
        errors.password = 'Required';
    }

    if (!location) {
        errors.location = 'Please select a location';
    }

    return errors;
};

const Login = () => {
    const { formGap } = useStyles();
    const { isLoggedIn, handleLogin } = useAuthContext();

    const onSubmit = async ({ username, password, location }: FormValues) => {
        if (!location) return;

        const data = await handleLogin(username, password, location);

        if (data.token) {
            createToast({
                color: 'green',
                header: 'Success',
                message: `Enjoy your time here!`,
            });
        } else {
            createToast({
                color: 'red',
                header: 'Error',
                message: data,
            });
        }
    };

    const {
        values,
        handleChange,
        handleSubmit,
        setFieldValue,
        errors,
        isSubmitting,
    } = useFormik({
        initialValues: initialFormValues,
        validate,
        onSubmit,
        validateOnChange: false,
    });

    if (isLoggedIn()) return <Redirect to="/manage-inventory" />;

    return (
        <Container maxWidth="xs">
            <Paper variant="outlined">
                <Box p={3}>
                    <form className={formGap}>
                        <div>
                            <TextField
                                error={errors.username}
                                name="username"
                                label="Username"
                                variant="outlined"
                                size="small"
                                fullWidth
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <TextField
                                error={errors.password}
                                name="password"
                                type="password"
                                label="Password"
                                variant="outlined"
                                size="small"
                                fullWidth
                                onChange={handleChange}
                            />
                        </div>
                        <ControlledDropdown
                            error={errors.location}
                            value={values.location || ''}
                            label="Location"
                            name="location"
                            options={locationDropdownOptions}
                            onChange={(v) => {
                                setFieldValue('location', v);
                            }}
                        />
                        <Button
                            fullWidth
                            primary
                            onClick={() => handleSubmit()}
                            disabled={isSubmitting}
                        >
                            Submit
                        </Button>
                    </form>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;
