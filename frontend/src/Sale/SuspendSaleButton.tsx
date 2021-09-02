import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    makeStyles,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import React, { FC, useEffect, useState } from 'react';
import { DropdownProps, Form } from 'semantic-ui-react';
import { SuspendedSale } from '../context/getSuspendedSaleQuery';
import { SaleContext } from '../context/SaleContext';
import Button from '../ui/Button';
import TextField from '../ui/TextField';
import getSuspendedSalesQuery from './getSuspendedSalesQuery';

interface Props {
    /** The suspended sale ID */
    id: string;
    saleListLength: number;
    restoreSale: SaleContext['restoreSale'];
    deleteSuspendedSale: SaleContext['deleteSuspendedSale'];
    suspendSale: SaleContext['suspendSale'];
}

interface SuspendButtonState {
    suspendBtn: boolean;
    restoreBtn: boolean;
    deleteBtn: boolean;
}

const CharLimit: FC<{ text: string; limit: number }> = ({ text, limit }) => {
    const { charLimit } = useStyles();

    return (
        <div className={charLimit}>
            {text.length}/{limit}
        </div>
    );
};

const useStyles = makeStyles({
    charLimit: {
        fontSize: '12px',
        color: 'rgba(0, 0, 0, 0.4)',
        float: 'right',
    },
});

const SuspendSaleButton: FC<Props> = ({
    restoreSale,
    deleteSuspendedSale,
    saleListLength,
    suspendSale,
    id,
}) => {
    const [sales, setSales] = useState<SuspendedSale[]>([]);
    const [saleID, setSaleID] = useState<string>('');
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [customerName, setCustomerName] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    const [disabled, setDisabled] = useState<boolean>(false);
    const [loadingBtn, setLoadingBtn] = useState<SuspendButtonState>({
        suspendBtn: false,
        restoreBtn: false,
        deleteBtn: false,
    });

    const getSales = async () => {
        const suspendedSales = await getSuspendedSalesQuery();

        setSales(suspendedSales);
    };

    const clearFields = () => {
        setCustomerName('');
        setNotes('');
        setSaleID('');
    };

    // Get the previously suspended sales on mount and parent state (_id) change
    useEffect(() => {
        getSales();
    }, [id]); // If the parent-level suspended-sale _id changes, we fetch again

    const submitSuspendSale = async () => {
        setDisabled(true);
        setLoadingBtn({ ...loadingBtn, suspendBtn: true });
        await suspendSale({ customerName, notes });
        setModalOpen(false); // Close the modal to avoid "flicker" when state re-renders
        await getSales(); // Parent _id does not change, re-fetch sales
        clearFields();
        setDisabled(false);
        setLoadingBtn({ ...loadingBtn, suspendBtn: false });
    };

    const submitRestoreSale = async () => {
        setDisabled(true);
        setLoadingBtn({ ...loadingBtn, restoreBtn: true });
        await restoreSale(saleID);
        setModalOpen(false);
        clearFields();
        setDisabled(false);
        setLoadingBtn({ ...loadingBtn, restoreBtn: false });
    };

    const submitDeleteSale = async () => {
        setDisabled(true);
        setLoadingBtn({ ...loadingBtn, deleteBtn: true });
        await deleteSuspendedSale();
        setModalOpen(false);
        clearFields();
        setDisabled(false);
        setLoadingBtn({ ...loadingBtn, deleteBtn: false });
    };

    return (
        <React.Fragment>
            <div>
                <Button onClick={() => setModalOpen(true)}>
                    Sales menu icon
                </Button>
            </div>
            <Dialog open={modalOpen} maxWidth="md" fullWidth>
                <DialogTitle>Sales menu</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        {saleListLength > 0 && (
                            <React.Fragment>
                                <Grid item xs={6}>
                                    <h3>Suspend Sale</h3>
                                    {/* <Form> */}
                                    <div>
                                        <TextField
                                            fullWidth
                                            label="Customer Name"
                                            placeholder="Jace, the Mind Sculptor"
                                            value={customerName}
                                            onChange={(e) => {
                                                setCustomerName(
                                                    e.target.value.substring(
                                                        0,
                                                        50
                                                    )
                                                );
                                            }}
                                        />
                                    </div>
                                    <CharLimit text={customerName} limit={50} />
                                    <div>
                                        <TextField
                                            multiline
                                            minRows={3}
                                            fullWidth
                                            label="Notes"
                                            placeholder="Sometimes, I forget things..."
                                            value={notes}
                                            onChange={(e) => {
                                                setNotes(
                                                    e.target.value.substring(
                                                        0,
                                                        150
                                                    )
                                                );
                                            }}
                                        />
                                    </div>
                                    <CharLimit text={notes} limit={150} />
                                    <Button
                                        primary
                                        disabled={
                                            disabled ||
                                            !customerName ||
                                            loadingBtn.suspendBtn
                                        }
                                        onClick={submitSuspendSale}
                                    >
                                        Suspend Sale
                                    </Button>
                                    {/* </Form> */}
                                </Grid>
                            </React.Fragment>
                        )}
                        <Grid item xs={6}>
                            <h3>Restore Sale</h3>
                            {sales.length > 0 && (
                                <React.Fragment>
                                    <Form>
                                        <Form.Select
                                            fluid
                                            label="Previously suspended sales"
                                            options={sales.map((s) => {
                                                return {
                                                    key: s._id,
                                                    text: s.name,
                                                    value: s._id,
                                                };
                                            })}
                                            placeholder="Select a sale"
                                            onChange={(
                                                e,
                                                { value }: DropdownProps
                                            ) => {
                                                if (typeof value === 'string') {
                                                    setSaleID(value);
                                                }
                                            }}
                                        />
                                        <Form.Button
                                            primary
                                            disabled={
                                                disabled ||
                                                !saleID ||
                                                loadingBtn.restoreBtn
                                            }
                                            onClick={submitRestoreSale}
                                        >
                                            Restore Sale
                                        </Form.Button>
                                    </Form>
                                </React.Fragment>
                            )}
                            {sales.length === 0 && (
                                <Alert severity="info">
                                    <AlertTitle>No sales</AlertTitle>
                                    Suspend a sale first
                                </Alert>
                            )}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    {!!id && (
                        <Button
                            disabled={disabled || loadingBtn.deleteBtn}
                            onClick={submitDeleteSale}
                        >
                            Delete current Sale
                        </Button>
                    )}
                    <Button
                        primary
                        disabled={disabled}
                        onClick={() => setModalOpen(false)}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default SuspendSaleButton;
