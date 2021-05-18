import React, { FC } from 'react';
import { Segment, Header, Icon } from 'semantic-ui-react';

interface Props {
    active: boolean;
}

const DefaultPlaceholder: FC<Props> = ({ active, children }) => {
    return (
        <>
            {active && (
                <Segment placeholder>
                    <Header icon>
                        <Icon name="search" />
                        <em>{children}</em>
                    </Header>
                </Segment>
            )}
        </>
    );
};

export default DefaultPlaceholder;
