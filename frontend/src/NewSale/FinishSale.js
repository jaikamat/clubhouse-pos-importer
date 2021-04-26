import React, { useState, useContext } from 'react';
import { Modal, Button, Header, Icon } from 'semantic-ui-react';
import { SaleContext } from '../context/SaleContext';

export default function FinishSale() {
    const [submit, setSubmit] = useState({ loading: false, disabled: false });
    const [showModal, setShowModal] = useState(false);
    const { finalizeSale } = useContext(SaleContext);

    const handleFinalizeSale = async () => {
        setSubmit({ loading: true, disabled: true });
        await finalizeSale();
    }

    const modalTrigger = <Button floated="right" primary
        onClick={() => setShowModal(true)}>
        Finalize sale
        </Button>

    return <Modal
        basic
        open={showModal}
        trigger={modalTrigger}>
        <Modal.Content>
            <Header inverted as="h2">
                Finalize this sale?
             </Header>
            <p>
                Click 'Yes' to create a sale
                in Lightspeed. Ensure that
                you have all cards pulled and double-checked
                the customer list. Undoing this action will require manual data entry!
             </p>
        </Modal.Content>
        <Modal.Actions>
            <Button
                basic
                color="red"
                inverted
                onClick={() => setShowModal(false)}>
                <Icon name="remove" /> No
             </Button>
            <Button
                color="green"
                inverted
                onClick={handleFinalizeSale}
                loading={submit.loading}
                disabled={submit.disabled}>
                <Icon name="checkmark" /> Yes
            </Button>
        </Modal.Actions>
    </Modal>
}