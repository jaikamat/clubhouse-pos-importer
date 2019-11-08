import React from 'react';
import logo from './logo.svg';

function Home() {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Creating an app for my Local Game Shop (LGS) to manage their custom inventory
                    via LightSpeed POS!
                </p>
                <a
                    className="App-link"
                    href="https://cloud.lightspeedapp.com/oauth/authorize.php?responsetype=code&clientid=7f1bce760ee9edb8fdd3426b0cc8b4289b2b6f11c5fc737e248fd9d8fd6c4564&scope=employee:inventory"
                >
                    Click to login
                </a>
            </header>
        </div>
    );
}

export default Home;
