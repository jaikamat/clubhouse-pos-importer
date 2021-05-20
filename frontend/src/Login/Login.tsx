import React, { SyntheticEvent } from 'react';
import createToast from '../common/createToast';
import { Form, Button, Segment, Select } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import { ClubhouseLocation, useAuthContext } from '../context/AuthProvider';
import styled from 'styled-components';
import { Formik } from 'formik';

interface FormValues {
    username: string;
    password: string;
    location: ClubhouseLocation;
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
    location: 'ch1',
};

const Login = () => {
    const { loggedIn, handleLogin } = useAuthContext();

    const onSubmit = async ({ username, password, location }: FormValues) => {
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

    if (loggedIn) return <Redirect to="/manage-inventory" />;

    return (
        <LoginContainer>
            <Formik initialValues={initialFormValues} onSubmit={onSubmit}>
                {({ values, handleSubmit, setFieldValue, isSubmitting }) => (
                    <FormContainer raised loading={isSubmitting}>
                        <Form>
                            <Form.Field>
                                <Form.Input
                                    className="username-input"
                                    placeholder="Username"
                                    label="Username"
                                    value={values.username}
                                    onChange={(_, { value }) =>
                                        setFieldValue('username', value)
                                    }
                                />
                            </Form.Field>
                            <Form.Field>
                                <Form.Input
                                    className="password-input"
                                    placeholder="Password"
                                    type="password"
                                    label="Password"
                                    value={values.password}
                                    onChange={(_, { value }) =>
                                        setFieldValue('password', value)
                                    }
                                />
                            </Form.Field>
                            <Form.Field
                                label="Location"
                                control={Select}
                                value={values.location}
                                placeholder="Select location"
                                options={[
                                    {
                                        key: 'beaverton',
                                        text: 'Beaverton (The OG)',
                                        value: 'ch1',
                                    },
                                    {
                                        key: 'hillsboro',
                                        text: 'Hillsboro',
                                        value: 'ch2',
                                    },
                                ]}
                                onChange={(
                                    _: SyntheticEvent,
                                    { value }: { value: ClubhouseLocation }
                                ) => {
                                    setFieldValue('location', value);
                                }}
                            />
                            <Button
                                primary
                                fluid
                                floated="right"
                                type="submit"
                                onClick={() => handleSubmit()}
                                className="login-btn"
                                disabled={
                                    !values.username ||
                                    !values.password ||
                                    !values.location
                                }
                            >
                                Submit
                            </Button>
                        </Form>
                    </FormContainer>
                )}
            </Formik>
        </LoginContainer>
    );
};

export default Login;
