import { Box } from '@material-ui/core';
import $ from 'jquery';
import React, { FC, useState } from 'react';
import CardImage from '../common/CardImage';
import { useReceivingContext } from '../context/ReceivingContext';
import CardHeader from '../ui/CardHeader';
import CardRowContainer from '../ui/CardRowContainer';
import { useToastContext } from '../ui/ToastContext';
import { ClientCard, Finish } from '../utils/ClientCard';
import createFinishCondition from '../utils/createFinishCondtition';
import ReceivingSearchItemForm, { FormValues } from './ReceivingSearchItemForm';

interface Props {
    card: ClientCard;
}

const ReceivingSearchItem: FC<Props> = ({ card }) => {
    const createToast = useToastContext();
    const { addToList } = useReceivingContext();
    const { cardImage, finishes, name } = card;
    // Defaults to 'NONFOIL', but the form component will manage this for us
    const [selectedFinish, setSelectedFinish] = useState<Finish>('NONFOIL');

    const handleInventoryAdd = ({
        quantity,
        cashPrice,
        creditPrice,
        marketPrice,
        selectedFinish,
        selectedCondition,
    }: FormValues) => {
        if (!quantity) throw new Error('Quantity is missing');

        addToList(quantity, card, {
            cashPrice: cashPrice || 0,
            marketPrice: marketPrice || 0,
            creditPrice: creditPrice || 0,
            finishCondition: createFinishCondition(
                selectedFinish,
                selectedCondition
            ),
        });

        createToast({
            severity: 'success',
            message: `${quantity}x ${name} added to buylist!`,
        });

        // Highlight the input after successful card add
        $('#searchBar').focus().select();
    };

    return (
        <CardRowContainer
            image={
                <Box width={125}>
                    <CardImage image={cardImage} hover />
                </Box>
            }
            header={
                <CardHeader
                    card={card}
                    selectedFinish={selectedFinish}
                    showMid
                />
            }
        >
            <ReceivingSearchItemForm
                onSubmit={handleInventoryAdd}
                onFinishSelect={(finish) => setSelectedFinish(finish)}
                cardFinishes={finishes}
            />
        </CardRowContainer>
    );
};

export default ReceivingSearchItem;
