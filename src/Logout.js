import React from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Header, Container } from 'semantic-ui-react';

const Logout = props => {
    if (!props.loggedIn) {
        return <Redirect to="/login" />;
    }

    return (
        <React.Fragment>
            <Container fluid>
                <Header as="h3" color="grey"><i>Until we meet again, friend...</i></Header>
                <Button onClick={() => props.handleLogin('', '')}>Logout</Button>
            </Container>
        </React.Fragment>
    );
};

export default Logout;
