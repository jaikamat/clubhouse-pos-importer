import React from 'react';
import createToast from '../common/createToast';
import { Form, Button, Segment } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import { ClubhouseLocation, useAuthContext } from '../context/AuthProvider';
import styled from 'styled-components';
import { FormikErrors, useFormik } from 'formik';
import FormikSelectField from '../ui/FormikSelectField';

interface FormValues {
    username: string;
    password: string;
    location: ClubhouseLocation | null;
}

const LoginContainer = styled.div`
    margin-top: 15px;
    display: flex;
    justify-content: center;
`;

const FormContainer = styled(Segment)`
    width: 400px;
    padding: 25px 25px 25px 25px !important;
`;

const initialFormValues: FormValues = {
    username: '',
    password: '',
    location: null,
};

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

// No validations needed for now
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
    const { loggedIn, handleLogin } = useAuthContext();

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

    if (loggedIn) return <Redirect to="/manage-inventory" />;

    return (
        <LoginContainer>
            <FormContainer raised loading={isSubmitting}>
                <Form>
                    <Form.Field>
                        <label>Username</label>
                        <Form.Input
                            error={errors.username}
                            onChange={handleChange}
                            name="username"
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Password</label>
                        <Form.Input
                            error={errors.password}
                            type="password"
                            onChange={handleChange}
                            name="password"
                        />
                    </Form.Field>
                    <FormikSelectField
                        error={errors.location}
                        label="Location"
                        name="location"
                        placeholder="Select location"
                        options={locationDropdownOptions}
                        onChange={(v) => {
                            setFieldValue('location', v);
                        }}
                    />
                    <Button
                        primary
                        fluid
                        type="submit"
                        onClick={() => handleSubmit()}
                    >
                        Submit
                    </Button>
                </Form>
            </FormContainer>
        </LoginContainer>
    );
};

export default Login;
