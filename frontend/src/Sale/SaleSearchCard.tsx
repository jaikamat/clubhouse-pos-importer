import { Box } from '@material-ui/core';
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

    // Defaults to 'NONFOIL', but the form component will manage this for us
    const [selectedFinish, setSelectedFinish] = useState<Finish>('NONFOIL');

    return (
        <CardRowContainer
            image={
                <Box width={100}>
                    <CardImage image={card.cardImage} />
                </Box>
            }
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
                cardId={card.id}
                cardQoh={card.qoh}
                cardFinishes={card.finishes}
                onFinishSelect={(f) => setSelectedFinish(f)}
                onSubmit={onSubmit}
            />
        </CardRowContainer>
    );
};

export default SaleSearchCard;
