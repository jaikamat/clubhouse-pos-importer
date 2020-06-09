import React from 'react';
import { Segment, Header, Icon } from 'semantic-ui-react';

export default function DefaultPlaceholder({ active, children }) {
    return <React.Fragment>
        {active &&
            <Segment placeholder>
                <Header icon>
                    <Icon name="search" />
                    <em>{children}</em>
                </Header>
            </Segment>}
    </React.Fragment>
}