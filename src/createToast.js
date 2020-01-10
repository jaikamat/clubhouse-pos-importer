import React from 'react';
import { Message } from 'semantic-ui-react';
import toaster from 'toasted-notes';

const createToast = ({ color, header, message, duration = 2000 }) => {
    return toaster.notify(
        () => (
            <Message color={color} compact>
                <Message.Header>{header}</Message.Header>
                {message}
            </Message>
        ),
        {
            position: 'bottom-right',
            duration: duration
        }
    );
}

export default createToast;