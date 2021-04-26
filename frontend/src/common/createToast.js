import React from 'react';
import { Message } from 'semantic-ui-react';
import toaster from 'toasted-notes';
import styled from 'styled-components';

const ToastContainer = styled(Message)`
    position: relative;
    right: 10px;
    bottom: 10px;
`;

const createToast = ({ color, header, message, duration = 2000 }) => {
    return toaster.notify(
        () => (
            <ToastContainer color={color} compact>
                <Message.Header>{header}</Message.Header>
                {message}
            </ToastContainer>
        ),
        {
            position: 'bottom-right',
            duration: duration
        }
    );
}

export default createToast;