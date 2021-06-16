import { Request } from 'express';
import { ValidationError } from 'joi';

export type ClubhouseLocation = 'ch1' | 'ch2';

export enum Trade {
    Cash = 'CASH',
    Credit = 'CREDIT',
}

export interface DecodedToken {
    userId: string;
    currentLocation: ClubhouseLocation;
}

export const finishes = [
    'NONFOIL_NM',
    'NONFOIL_LP',
    'NONFOIL_MP',
    'NONFOIL_HP',
    'FOIL_NM',
    'FOIL_LP',
    'FOIL_MP',
    'FOIL_HP',
] as const;

export type FinishCondition = typeof finishes[number];

export interface QOH {
    FOIL_NM?: number;
    FOIL_LP?: number;
    FOIL_MP?: number;
    FOIL_HP?: number;
    NONFOIL_NM?: number;
    NONFOIL_LP?: number;
    NONFOIL_MP?: number;
    NONFOIL_HP?: number;
}

export interface RequestWithUserInfo extends Request {
    locations: string[];
    currentLocation: ClubhouseLocation;
    isAdmin: boolean;
    lightspeedEmployeeNumber: number;
    userId: string;
}

export interface AddCardToInventoryReqBody {
    quantity: number;
    finishCondition: FinishCondition;
    cardInfo: {
        id: string;
        name: string;
        set_name: string;
        set: string;
    };
}

export interface AddCardToInventoryReq extends RequestWithUserInfo {
    body: AddCardToInventoryReqBody;
}

export interface FinishSaleCard {
    id: string;
    price: number;
    qtyToSell: number;
    finishCondition: FinishCondition;
    name: string;
    set_name: string;
}

export interface ReqWithFinishSaleCards extends RequestWithUserInfo {
    body: { cards: FinishSaleCard[] };
}

export interface ReceivingCard {
    id: string;
    quantity: number;
    name: string;
    set_name: string;
    finishCondition: FinishCondition;
    set: string;
    creditPrice: number;
    cashPrice: number;
    marketPrice: number;
    tradeType: Trade;
}

export interface ReqWithReceivingCards extends RequestWithUserInfo {
    body: { cards: ReceivingCard[] };
}

export interface SuspendSaleBody {
    customerName: string;
    notes: string;
    saleList: FinishSaleCard[];
}

export interface ReqWithSuspendSale extends RequestWithUserInfo {
    body: SuspendSaleBody;
}

export interface ReceivedCardQuery {
    startDate: string | null;
    endDate: string | null;
    cardName: string | null;
}

export interface JwtBody {
    username: string;
    password: string;
    currentLocation: ClubhouseLocation;
}

export interface JwtRequest extends Request {
    body: JwtBody;
}

export interface RequestWithQuery extends Request {
    query: {
        title: string;
    };
}

export type JoiValidation<T> = {
    error?: ValidationError;
    value: T;
};
