import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from '@material-ui/core';
import React, { FC, useState } from 'react';
import { useSaleContext } from '../context/SaleContext';
import Button from '../ui/Button';

interface Props {}

const FinishSale: FC<Props> = () => {
    const [submit, setSubmit] = useState({ loading: false, disabled: false });
    const [showModal, setShowModal] = useState(false);
    const { finalizeSale } = useSaleContext();

    const handleFinalizeSale = async () => {
        try {
            setSubmit({ loading: true, disabled: true });
            await finalizeSale();
        } catch (err) {
            setSubmit({ loading: false, disabled: false });
        }
    };

    return (
        <>
            <Button fullWidth primary onClick={() => setShowModal(true)}>
                Finalize sale
            </Button>
            {showModal && (
                <Dialog open>
                    <DialogTitle>Confirm sale</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Click 'Finish sale' to create a sale in Lightspeed.
                        </Typography>
                        <br />
                        <Typography>
                            Ensure that you have all cards pulled and
                            double-checked the customer list. Undoing this
                            action will require manual data entry!
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button
                            primary
                            onClick={handleFinalizeSale}
                            disabled={submit.disabled || submit.loading}
                        >
                            Finish sale
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
};

export default FinishSale;
