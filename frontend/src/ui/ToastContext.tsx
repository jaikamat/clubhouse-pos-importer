import { Snackbar } from '@material-ui/core';
import { Alert, AlertProps } from '@material-ui/lab';
import React, { FC, useContext, createContext, useState } from 'react';

type Severity = AlertProps['severity'];

interface ToastArgs {
    severity: Severity;
    message: string;
}

interface IToastContext {
    createToast: ({ severity, message }: ToastArgs) => void;
}

const ToastContext = createContext<IToastContext>({
    createToast: () => null,
});

const ToastProvider: FC = ({ children }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [severity, setSeverity] = useState<Severity>('success');
    const [message, setMessage] = useState<string>('');
    const handleClose = () => setOpen(false);

    const createToast = ({ severity, message }: ToastArgs) => {
        setSeverity(severity);
        setMessage(message);
        setOpen(true);
    };

    return (
        <ToastContext.Provider value={{ createToast }}>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                onClose={handleClose}
            >
                <Alert severity={severity}>{message}</Alert>
            </Snackbar>
            {children}
        </ToastContext.Provider>
    );
};

export const useToastContext = () => {
    const { createToast } = useContext(ToastContext);
    return createToast;
};

export default ToastProvider;
