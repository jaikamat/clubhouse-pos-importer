import $ from 'jquery';
import React, { FC, useState } from 'react';
import CardImage from '../common/CardImage';
import { useInventoryContext } from '../context/InventoryContext';
import CardHeader from '../ui/CardHeader';
import CardRowContainer from '../ui/CardRowContainer';
import { useToastContext } from '../ui/ToastContext';
import { ClientCard, Finish } from '../utils/ClientCard';
import createFinishCondition from '../utils/createFinishCondtition';
import addCardToInventoryQuery from './addCardToInventoryQuery';
import ManageInventoryCardForm, { FormValues } from './ManageInventoryCardForm';

interface Props {
    card: ClientCard;
}

const ManageInventoryListItem: FC<Props> = ({ card }) => {
    const { createToast, createErrorToast } = useToastContext();
    const { finishes, name, set_name, set, id, cardImage } = card;

    // Defaults to 'NONFOIL', but the form component will manage this for us
    const [selectedFinish, setSelectedFinish] = useState<Finish>('NONFOIL');

    const { changeCardQuantity } = useInventoryContext();

    const onSubmit = async ({
        quantity,
        selectedFinish,
        selectedCondition,
    }: FormValues) => {
        try {
            const { qoh } = await addCardToInventoryQuery({
                quantity: parseInt(quantity, 10),
                finishCondition: createFinishCondition(
                    selectedFinish,
                    selectedCondition
                ),
                cardInfo: { id, name, set_name, set },
            });

            changeCardQuantity(id, qoh);

            createToast({
                severity: 'success',
                message: `${quantity}x ${name} ${
                    parseInt(quantity, 10) > 0 ? 'added' : 'removed'
                }!`,
            });

            // Highlight the input after successful card add
            $('#searchBar').focus().select();
        } catch (err) {
            console.log(err);
            createErrorToast(err);
        }
    };

    return (
        <CardRowContainer
            image={<CardImage image={cardImage} width={125} hover />}
            header={
                <CardHeader card={card} selectedFinish={selectedFinish} round />
            }
        >
            <ManageInventoryCardForm
                onSubmit={onSubmit}
                onFinishSelect={(finish) => setSelectedFinish(finish)}
                cardFinishes={finishes}
            />
        </CardRowContainer>
    );
};

export default ManageInventoryListItem;
