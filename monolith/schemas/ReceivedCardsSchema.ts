import { Schema } from 'mongoose';
import { FinishCondition, Trade } from '../common/types';

export interface ReceivingCard {
    quantity: number;
    finishCondition: FinishCondition;
    id: string;
    name: string;
    set_name: string;
    set: string;
    creditPrice: number | null;
    cashPrice: number | null;
    marketPrice: number | null;
    tradeType: Trade;
}

const ReceivingCardSchema = new Schema<ReceivingCard>(
    {
        quantity: { type: Number, required: true },
        finishCondition: { type: String, required: true },
        id: { type: String, required: true },
        name: { type: String, required: true },
        set_name: { type: String, required: true },
        set: { type: String, required: true },
        creditPrice: { type: Number },
        cashPrice: { type: Number },
        marketPrice: { type: Number },
        tradeType: { type: String, required: true },
    },
    { _id: false }
);

export interface ReceivedCards {
    created_at: string;
    employee_number: number;
    received_card_list: ReceivingCard[];
    created_by: string;
    customer_name: string;
    customer_contact: string;
}

const ReceivedCardsSchema = new Schema<ReceivedCards>({
    created_at: { type: String, required: true },
    employee_number: { type: Number, required: true },
    received_card_list: { type: [ReceivingCardSchema], required: true },
    created_by: { type: String, required: true },
    customer_name: { type: String, required: true },
    customer_contact: { type: String },
});

export default ReceivedCardsSchema;
