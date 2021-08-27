import React from 'react';
import { Message } from 'semantic-ui-react';
import styled from 'styled-components';
import toaster from 'toasted-notes';

const ToastContainer = styled(Message)`
    position: relative;
    right: 10px;
    bottom: 10px;
`;

interface CreateToastArgs {
    color: string;
    header: string;
    message?: string;
    duration?: number;
}

const createToast = ({
    color,
    header,
    message,
    duration = 2000,
}: CreateToastArgs) => {
    return toaster.notify(
        () => (
            <ToastContainer color={color} compact>
                <Message.Header>{header}</Message.Header>
                {message}
            </ToastContainer>
        ),
        {
            position: 'bottom-right',
            duration: duration,
        }
    );
};

export default createToast;
