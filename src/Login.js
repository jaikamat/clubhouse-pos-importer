import React from 'react';
import axios from 'axios';
import { LOGIN } from './api_resources';
import { Form, Button } from 'semantic-ui-react';

class Login extends React.Component {
    state = { username: '', password: '' };

    login = async () => {
        const { username, password } = this.state;

        try {
            const { data } = await axios.post(LOGIN, { username, password });
            if (data.token !== 'Not authorized') {
                localStorage.setItem('clubhouse_JWT', data.token);
                console.log('token was set!');
            } else {
                localStorage.clear();
                console.log('Not authorized!');
            }
        } catch (err) {
            console.log(err);
        }
    };

    handleInputChange = (e, { value }) => {
        this.setState({ [e.target.name]: value });
    };

    render() {
        const { username, password } = this.state;

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
                        label="Password"
                        value={password}
                        onChange={this.handleInputChange}
                    />
                </Form.Field>
                <Button
                    type="submit"
                    onClick={this.login}
                    disabled={!username || !password}
                >
                    Submit
                </Button>
            </Form>
        );
    }
}

export default Login;
