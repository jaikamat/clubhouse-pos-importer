import React from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Header, Container } from 'semantic-ui-react';
import { AuthContext } from './AuthProvider';

class Logout extends React.Component {
    render() {
        return (
            <AuthContext.Consumer>
                {({ loggedIn, handleLogout }) => {
                    if (!loggedIn) {
                        return <Redirect to="/login" />;
                    }

                    return (
                        <React.Fragment>
                            <Container fluid>
                                <Header as="h3" color="grey"><i>Until we meet again, friend...</i></Header>
                                <Button onClick={async () => await handleLogout()}>Logout</Button>
                            </Container>
                        </React.Fragment>
                    )
                }}
            </AuthContext.Consumer>
        )
    }
};

export default Logout;
