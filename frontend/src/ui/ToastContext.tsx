import { Snackbar } from '@material-ui/core';
import { Alert, AlertProps } from '@material-ui/lab';
import React, { createContext, FC, useContext, useState } from 'react';

type Severity = AlertProps['severity'];

interface ToastArgs {
    severity: Severity;
    message: string;
}

interface IToastContext {
    createToast: ({ severity, message }: ToastArgs) => void;
    createErrorToast: (err: any) => void;
}

const ToastContext = createContext<IToastContext>({
    createToast: () => null,
    createErrorToast: () => null,
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

    /**
     * We can't make any assumptions about error objects when caught at runtime,
     * so here we create a toast and stringify the object for convenience
     */
    const createErrorToast = (err: any) => {
        createToast({
            severity: 'error',
            message: JSON.stringify(err, null, 2),
        });
    };

    return (
        <ToastContext.Provider value={{ createToast, createErrorToast }}>
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

export const useToastContext = () => useContext(ToastContext);

export default ToastProvider;
