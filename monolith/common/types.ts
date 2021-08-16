import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'joi';

export type ClubhouseLocation = 'ch1' | 'ch2';

export enum Trade {
    Cash = 'CASH',
    Credit = 'CREDIT',
}

export const locations: Readonly<[ClubhouseLocation, ClubhouseLocation]> = [
    'ch1',
    'ch2',
] as const;

export const finishConditions = [
    'NONFOIL_NM',
    'NONFOIL_LP',
    'NONFOIL_MP',
    'NONFOIL_HP',
    'FOIL_NM',
    'FOIL_LP',
    'FOIL_MP',
    'FOIL_HP',
] as const;

export type FinishCondition = typeof finishConditions[number];

export const priceFilters = ['gte', 'lte', 'gt', 'lt'] as const;

export type PriceFilter = typeof priceFilters[number];

export const formatLegalities = [
    'standard',
    'future',
    'historic',
    'pioneer',
    'modern',
    'legacy',
    'pauper',
    'vintage',
    'penny',
    'commander',
    'brawl',
    'duel',
    'oldschool',
] as const;

export type FormatLegality = typeof formatLegalities[number];

export const finish = ['FOIL', 'NONFOIL'] as const;

export type Finish = typeof finish[number];

export const sortBy = ['price', 'name', 'quantityInStock'] as const;

export type SortBy = typeof sortBy[number];

export const sortByDirection = [-1, 1] as const;

export type SortByDirection = typeof sortByDirection[number];

export const colorSpecificity = ['colorless', 'mono', 'multi'] as const;

export type ColorSpecificity = typeof colorSpecificity[number];

export const typeLines = [
    'Artifact',
    'Creature',
    'Enchantment',
    'Instant',
    'Land',
    'Planeswalker',
    'Sorcery',
    'Tribal',
] as const;

export type TypeLine = typeof typeLines[number];

export const frames = ['borderless', 'extendedArt', 'showcase'] as const;

export type Frame = typeof frames[number];

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

export interface ReceivingBody {
    customerName: string;
    customerContact: string | null;
    cards: ReceivingCard[];
}

export interface ReqWithReceivingCards extends RequestWithUserInfo {
    body: ReceivingBody;
}

export interface SuspendSaleBody {
    customerName: string;
    notes: string;
    saleList: FinishSaleCard[];
}

export interface ReqWithSuspendSale extends RequestWithUserInfo {
    body: SuspendSaleBody;
}

export interface JwtBody {
    username: string;
    password: string;
    currentLocation: ClubhouseLocation;
}

export interface JwtRequest extends Request {
    body: JwtBody;
}

export type JoiValidation<T> = {
    error?: ValidationError;
    value: T;
};

export enum Collection {
    cardInventory = 'card_inventory',
    salesData = 'sales_data',
    suspendedSales = 'suspended_sales',
    receivedCards = 'received_cards',
    cardInventory2 = 'card_inventory_ch2',
    salesData2 = 'sales_data_ch2',
    suspendedSales2 = 'suspended_sales_ch2',
    receivedCards2 = 'received_cards_ch2',
    scryfallBulkCards = 'scryfall_bulk_cards',
    users = 'users',
}

/**
 * Helper type used to define controller signatures
 */
export type Controller<T extends Request> = (
    req: T,
    res: Response,
    next?: NextFunction
) => void;
