import React, { useState, useContext } from 'react';
import createToast from '../common/createToast';
import { Form, Button, Segment } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import styled from 'styled-components';

const LoginContainer = styled.div`
    margin-top: 15px;
    display: flex;
    justify-content: center;
`;

const FormContainer = styled(Segment)`
    width: 400px;
    padding: 25px 25px 25px 25px !important;
`;

const initialState = { username: '', password: '', loading: false };

export default function Login() {
    const [state, setState] = useState(initialState);
    const { loggedIn, handleLogin } = useContext(AuthContext);

    const handleInputChange = (e, { value }) => setState({ ...state, [e.target.name]: value });

    const login = async () => {
        setState({ loading: true });

        const { authed } = await handleLogin(state.username, state.password);

        if (authed) {
            // Do not set state here to mitigate React setState warning after component unmounted due to redirect
            createToast({
                color: 'green',
                header: 'Success',
                message: `Enjoy your time here!`,
            });
        } else {
            setState(initialState);
            createToast({
                color: 'red',
                header: 'Error',
                message: `Username or password was incorrect`,
            });
        }
    };

    if (loggedIn) return <Redirect to="/manage-inventory" />

    return <LoginContainer>
        <FormContainer raised loading={state.loading}>
            <Form>
                <Form.Field>
                    <Form.Input
                        className="username-input"
                        name="username"
                        placeholder="Username"
                        label="Username"
                        value={state.username || ''}
                        onChange={handleInputChange}
                    />
                </Form.Field>
                <Form.Field>
                    <Form.Input
                        className="password-input"
                        name="password"
                        placeholder="Password"
                        type="password"
                        label="Password"
                        value={state.password || ''}
                        onChange={handleInputChange}
                    />
                </Form.Field>
                <Button
                    primary
                    fluid
                    floated="right"
                    type="submit"
                    onClick={login}
                    className="login-btn"
                    disabled={!state.username || !state.password}>
                    Submit
            </Button>
            </Form>
        </FormContainer>
    </LoginContainer>
}
