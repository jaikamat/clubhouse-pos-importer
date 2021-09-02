import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import React, { FC, useEffect, useState } from 'react';
import { DropdownProps, Form, TextAreaProps } from 'semantic-ui-react';
import styled from 'styled-components';
import { SuspendedSale } from '../context/getSuspendedSaleQuery';
import { SaleContext } from '../context/SaleContext';
import Button from '../ui/Button';
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

const ClearMargin = styled.div`
    margin-top: 0px;
    margin-bottom: 0px;
`;

const CharLimit = styled.p`
    font-size: 12px;
    color: rgba(0, 0, 0, 0.2);
    float: right;
`;

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
                                    <Form>
                                        <ClearMargin>
                                            <Form.Input
                                                id="suspend-sale-name"
                                                label="Customer Name"
                                                placeholder="Jace, the Mind Sculptor"
                                                value={customerName}
                                                onChange={(e, { value }) =>
                                                    setCustomerName(
                                                        value.substring(0, 50)
                                                    )
                                                }
                                            />
                                        </ClearMargin>
                                        <ClearMargin>
                                            <CharLimit>
                                                {customerName.length}/50
                                            </CharLimit>
                                        </ClearMargin>
                                        <ClearMargin>
                                            <Form.TextArea
                                                label="Notes"
                                                placeholder="Sometimes, I forget things..."
                                                value={notes}
                                                onChange={(
                                                    e,
                                                    { value }: TextAreaProps
                                                ) => {
                                                    if (
                                                        typeof value ===
                                                        'string'
                                                    ) {
                                                        setNotes(
                                                            value.substring(
                                                                0,
                                                                150
                                                            )
                                                        );
                                                    }
                                                }}
                                            />
                                        </ClearMargin>
                                        <ClearMargin>
                                            <CharLimit>
                                                {notes.length}/150
                                            </CharLimit>
                                        </ClearMargin>
                                        <Form.Button
                                            id="suspend-sale-submit"
                                            primary
                                            disabled={disabled || !customerName}
                                            loading={loadingBtn.suspendBtn}
                                            onClick={submitSuspendSale}
                                        >
                                            Suspend Sale
                                        </Form.Button>
                                    </Form>
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
