import http from '../common/http';
import { ClubhouseLocation } from '../context/AuthProvider';
import { Trade } from '../context/ReceivingContext';
import { RECEIVING } from '../utils/endpoints';
import { FinishCondition, ScryfallApiCard } from '../utils/ScryfallCard';

interface ReceivedUser {
    _id: string;
    lightspeedEmployeeNumber: number;
    locations: ClubhouseLocation[];
    username: string;
}

/**
 * Individual receiving entities contain bulk card information
 * so users can view images, frames, etc.
 */
export interface ReceivedCard {
    quantity: number;
    marketPrice: number;
    cashPrice: number;
    creditPrice: number;
    tradeType: Trade;
    finishCondition: FinishCondition;
    // TODO: this casing difference is mildly irritating...
    bulk_card_data: ScryfallApiCard;
}

export interface Received {
    _id: string;
    created_at: string;
    employee_number: string;
    received_cards: ReceivedCard[];
    created_by: ReceivedUser;
    customer_name: string | null;
    customer_contact: string | null;
}

const receivedByIdQuery = async (receivedId: string) => {
    const { data } = await http.get<Received>(`${RECEIVING}/${receivedId}`);

    // We still need to convert ScryfallApiCard to ScryfallCard downstream
    return data;
};

export default receivedByIdQuery;
