import { model } from 'mongoose';
import { ClubhouseLocation } from '../common/types';
import ReceivedCardsSchema, {
    ReceivedCards,
} from '../schemas/ReceivedCardsSchema';

const ReceivedCardsModelCh1 = model<ReceivedCards>(
    'ReceivedCardsSchema',
    ReceivedCardsSchema,
    'received_cards'
);

const ReceivedCardsModelCh2 = model<ReceivedCards>(
    'ReceivedCardsSchema',
    ReceivedCardsSchema,
    'received_cards_ch2'
);

const getReceivedCardsModel = (location: ClubhouseLocation) => {
    if (location === 'ch1') return ReceivedCardsModelCh1;
    if (location === 'ch2') return ReceivedCardsModelCh2;
};

export default getReceivedCardsModel;
