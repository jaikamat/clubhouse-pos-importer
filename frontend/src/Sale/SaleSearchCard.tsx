import $ from 'jquery';
import React, { FC, useState } from 'react';
import CardImage from '../common/CardImage';
import { useSaleContext } from '../context/SaleContext';
import CardHeader from '../ui/CardHeader';
import CardRowContainer from '../ui/CardRowContainer';
import { ClientCard, Finish } from '../utils/ClientCard';
import roundPrice from '../utils/roundPrice';
import SaleSearchCardForm, { FormValues } from './SaleSearchCardForm';

interface Props {
    card: ClientCard;
}

const SaleSearchCard: FC<Props> = ({ card }) => {
    const { addToSaleList } = useSaleContext();
    const { id, qoh, cardImage } = card;

    // Defaults to 'NONFOIL', but the form component will manage this for us
    const [selectedFinish, setSelectedFinish] = useState<Finish>('NONFOIL');

    const onSubmit = ({
        selectedFinishCondition,
        quantityToSell,
        price,
    }: FormValues) => {
        const roundedPrice = roundPrice(price);

        addToSaleList(
            card,
            selectedFinishCondition,
            quantityToSell,
            roundedPrice
        );

        // Highlight the input after successful card add
        $('#searchBar').focus().select();
    };

    return (
        <CardRowContainer
            image={<CardImage image={cardImage} width={125} hover />}
            header={
                <CardHeader
                    card={card}
                    showMid
                    round
                    selectedFinish={selectedFinish}
                />
            }
        >
            <SaleSearchCardForm
                cardId={id}
                cardQoh={qoh}
                onFinishSelect={(f) => setSelectedFinish(f)}
                onSubmit={onSubmit}
            />
        </CardRowContainer>
    );
};

export default SaleSearchCard;
