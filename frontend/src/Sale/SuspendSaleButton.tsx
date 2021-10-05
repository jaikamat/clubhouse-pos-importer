import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    makeStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { Alert, AlertTitle } from '@material-ui/lab';
import React, { FC, useEffect, useState } from 'react';
import { SuspendedSale } from '../context/getSuspendedSaleQuery';
import { Context } from '../context/SaleContext';
import Button from '../ui/Button';
import ControlledDropdown from '../ui/ControlledDropdown';
import TextField from '../ui/TextField';
import getSuspendedSalesQuery from './getSuspendedSalesQuery';

interface Props {
    /** The suspended sale ID */
    id: string;
    saleListLength: number;
    restoreSale: Context['restoreSale'];
    deleteSuspendedSale: Context['deleteSuspendedSale'];
    suspendSale: Context['suspendSale'];
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
        <>
            <div>
                <IconButton
                    disabled={disabled}
                    onClick={() => setModalOpen(true)}
                    size="small"
                >
                    <MoreHorizIcon />
                </IconButton>
            </div>
            <Dialog open={modalOpen} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <h3>Sales menu</h3>
                        <IconButton
                            disabled={disabled}
                            onClick={() => setModalOpen(false)}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        {saleListLength > 0 && (
                            <Grid item xs={6}>
                                <h4>Suspend sale</h4>
                                <div>
                                    <TextField
                                        fullWidth
                                        label="Customer Name"
                                        placeholder="Jace, the Mind Sculptor"
                                        value={customerName}
                                        onChange={(e) => {
                                            setCustomerName(
                                                e.target.value.substring(0, 50)
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
                                                e.target.value.substring(0, 150)
                                            );
                                        }}
                                    />
                                </div>
                                <CharLimit text={notes} limit={150} />
                                <br />
                                <Button
                                    fullWidth
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
                            </Grid>
                        )}
                        <Grid item xs={6}>
                            <h4>Restore suspended sale</h4>
                            {sales.length > 0 && (
                                <>
                                    <div>
                                        <ControlledDropdown
                                            value={saleID}
                                            name="suspendedsales"
                                            onChange={(val) => setSaleID(val)}
                                            options={sales.map((s) => {
                                                return {
                                                    key: s._id,
                                                    text: s.name,
                                                    value: s._id,
                                                };
                                            })}
                                        />
                                    </div>
                                    <br />
                                    <div>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Button
                                                    fullWidth
                                                    primary
                                                    disabled={
                                                        disabled ||
                                                        !saleID ||
                                                        loadingBtn.restoreBtn
                                                    }
                                                    onClick={submitRestoreSale}
                                                >
                                                    Restore Sale
                                                </Button>
                                            </Grid>
                                            {!!id && (
                                                <Grid item xs={6}>
                                                    <Button
                                                        fullWidth
                                                        disabled={
                                                            disabled ||
                                                            loadingBtn.deleteBtn
                                                        }
                                                        onClick={
                                                            submitDeleteSale
                                                        }
                                                    >
                                                        Delete current Sale
                                                    </Button>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </div>
                                </>
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
            </Dialog>
        </>
    );
};

export default SuspendSaleButton;
