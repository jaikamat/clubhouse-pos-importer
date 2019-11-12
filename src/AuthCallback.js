import React from 'react';
import queryString from 'query-string';

// This will receive the callback from the OAuth login
// Depending on the queryparams, we should:
// 1. Fetch the actual token from LightSpeed
// 2. Commit them to sessionStorage?
// Then redirect back to the homepage

class AuthCallback extends React.Component {
    render() {
        console.log(this.props);
        return (
            <p>
                Testing callback. Search params:{' '}
                {JSON.stringify(queryString.parse(this.props.location.search))}
            </p>
        );
    }
}

export default AuthCallback;
