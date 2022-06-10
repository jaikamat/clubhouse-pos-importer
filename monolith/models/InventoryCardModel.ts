import { model } from 'mongoose';
import { ClubhouseLocation } from '../common/types';
import InventoryCardSchema, {
    InventoryCard,
} from '../schemas/InventoryCardSchema';

const InventoryCardModelCh1 = model<InventoryCard>(
    'InventoryCard',
    InventoryCardSchema,
    'card_inventory'
);

const InventoryCardModelCh2 = model<InventoryCard>(
    'InventoryCard',
    InventoryCardSchema,
    'card_inventory_ch2'
);

const getInventoryCardModel = (location: ClubhouseLocation) => {
    if (location === 'ch1') return InventoryCardModelCh1;
    if (location === 'ch2') return InventoryCardModelCh2;
};

export default getInventoryCardModel;
