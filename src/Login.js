import React from 'react';
import createToast from './createToast';
import { Form, Button } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

const initialState = { username: '', password: '', btnLoading: false };

class Login extends React.Component {
    state = initialState;

    handleInputChange = (e, { value }) => {
        this.setState({ [e.target.name]: value });
    };

    login = async () => {
        const { username, password } = this.state;

        this.setState({ btnLoading: true });

        const { authed } = await this.props.handleLogin(username, password);

        if (authed) {
            // Do not set state here to mitigate React setState warning after component unmounted due to redirect
            createToast({
                color: 'green',
                header: 'Success',
                message: `Enjoy your time here!`,
            });
        } else {
            this.setState(initialState);
            createToast({
                color: 'red',
                header: 'Error',
                message: `Username or password was incorrect`,
            });
        }
    };

    render() {
        const { username, password, btnLoading } = this.state;
        const { loggedIn } = this.props;

        if (loggedIn) {
            return <Redirect to="/manage-inventory" />;
        }

        return (
            <Form>
                <Form.Field>
                    <Form.Input
                        name="username"
                        placeholder="Username"
                        label="Username"
                        value={username}
                        onChange={this.handleInputChange}
                    />
                </Form.Field>
                <Form.Field>
                    <Form.Input
                        name="password"
                        placeholder="Password"
                        type="password"
                        label="Password"
                        value={password}
                        onChange={this.handleInputChange}
                    />
                </Form.Field>
                <Button
                    type="submit"
                    onClick={this.login}
                    disabled={!username || !password}
                    loading={btnLoading}
                >
                    Submit
                </Button>
            </Form>
        );
    }
}

export default Login;