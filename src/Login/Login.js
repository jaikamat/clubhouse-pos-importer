import React, { useContext } from 'react';
import createToast from '../common/createToast';
import { Form, Button, Segment, Select } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import styled from 'styled-components';
import { Formik } from 'formik';

const LoginContainer = styled.div`
    margin-top: 15px;
    display: flex;
    justify-content: center;
`;

const FormContainer = styled(Segment)`
    width: 400px;
    padding: 25px 25px 25px 25px !important;
`;

export default function Login() {
    const { loggedIn, handleLogin } = useContext(AuthContext);

    const onSubmit = async ({ username, password, location }) => {
        const { authed } = await handleLogin(username, password, location);

        if (authed) {
            createToast({
                color: 'green',
                header: 'Success',
                message: `Enjoy your time here!`,
            });
        } else {
            createToast({
                color: 'red',
                header: 'Error',
                message: `Username or password was incorrect`,
            });
        }
    };

    if (loggedIn) return <Redirect to="/manage-inventory" />;

    return (
        <LoginContainer>
            <Formik
                initialValues={{
                    username: '',
                    password: '',
                    location: '',
                }}
                onSubmit={onSubmit}
            >
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
                                        key: 'alpha',
                                        text: 'Clubhouse OG',
                                        value: 'ch1',
                                    },
                                    {
                                        key: 'beta',
                                        text: 'Cluhouse Prime',
                                        value: 'ch2',
                                    },
                                ]}
                                onChange={(_, { value }) => {
                                    setFieldValue('location', value);
                                }}
                            />
                            <Button
                                primary
                                fluid
                                floated="right"
                                type="submit"
                                onClick={handleSubmit}
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
}
