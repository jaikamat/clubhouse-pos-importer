import { Schema } from 'mongoose';

export type Qoh = Partial<{
    FOIL_NM: number;
    FOIL_LP: number;
    FOIL_MP: number;
    FOIL_HP: number;
    NONFOIL_NM: number;
    NONFOIL_LP: number;
    NONFOIL_MP: number;
    NONFOIL_HP: number;
    ETCHED_NM: number;
    ETCHED_LP: number;
    ETCHED_MP: number;
    ETCHED_HP: number;
}>;

const QohSchema = new Schema<Qoh>({
    FOIL_NM: { type: Number },
    FOIL_LP: { type: Number },
    FOIL_MP: { type: Number },
    FOIL_HP: { type: Number },
    NONFOIL_NM: { type: Number },
    NONFOIL_LP: { type: Number },
    NONFOIL_MP: { type: Number },
    NONFOIL_HP: { type: Number },
    ETCHED_NM: { type: Number },
    ETCHED_LP: { type: Number },
    ETCHED_MP: { type: Number },
    ETCHED_HP: { type: Number },
});

export interface InventoryCard {
    _id: string;
    name: string;
    qoh: Qoh;
    set: string;
    set_name: string;
}

const InventoryCardSchema = new Schema<InventoryCard>(
    {
        _id: { type: String, required: true },
        name: { type: String, required: true },
        qoh: { type: QohSchema, required: true },
        set: { type: String, required: true },
        set_name: { type: String, required: true },
    },
    { versionKey: false }
);

export default InventoryCardSchema;
