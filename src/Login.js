import React from 'react';
import { Form, Button } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

class Login extends React.Component {
    state = { username: '', password: '' };

    handleInputChange = (e, { value }) => {
        this.setState({ [e.target.name]: value });
    };

    render() {
        const { username, password } = this.state;
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
                    onClick={() => this.props.handleLogin(username, password)}
                    disabled={!username || !password}
                >
                    Submit
                </Button>
            </Form>
        );
    }
}

export default Login;
