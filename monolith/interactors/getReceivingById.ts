import e from 'express';
import mongoose from 'mongoose';
import { ScryfallApiCard } from '../common/ScryfallApiCard';
import { ClubhouseLocation, Collection } from '../common/types';
import collectionFromLocation from '../lib/collectionFromLocation';
import getReceivedCardsModel from '../models/ReceivedCardsModel';
import { ScryfallCard } from '../schemas/ScryfallCardSchema';

interface AggregateResult {
    _id: string;
    created_at: string;
    customer_name: string;
    customer_contact?: string;
    received_cards: Array<{ bulk_card_data: ScryfallCard }>;
}

async function getReceivingById(id: string, location: ClubhouseLocation) {
    try {
        const results = await getReceivedCardsModel(location)
            .aggregate<AggregateResult>()
            .match({ _id: new mongoose.Types.ObjectId(id) })
            .addFields({
                created_at: {
                    $toDate: '$_id',
                },
                /** Convert to ObjectId for proper $lookup types */
                user_id: {
                    $toObjectId: '$created_by',
                },
            })
            .lookup({
                from: Collection.scryfallBulkCards,
                localField: 'received_card_list.id',
                foreignField: 'id',
                as: 'scryfall_cards',
            })
            .lookup({
                from: collectionFromLocation(location).users,
                localField: 'user_id',
                foreignField: '_id',
                as: 'created_by',
            })
            .project({
                created_at: 1,
                created_by: {
                    $arrayElemAt: ['$created_by', 0],
                },
                customer_name: 1,
                customer_contact: 1,
                /**
                 * We iterate over the previous card list and replace
                 * its entries with scryfall bulk data through `$filter`
                 * and `id` equivalence.
                 *
                 * `$filter` resolves to an array, hence wrapping in `$arrayElemAt`.
                 */
                received_cards: {
                    $map: {
                        input: '$received_card_list',
                        as: 'item',
                        in: {
                            quantity: '$$item.quantity',
                            marketPrice: '$$item.marketPrice',
                            cashPrice: '$$item.cashPrice',
                            creditPrice: '$$item.creditPrice',
                            tradeType: '$$item.tradeType',
                            finishCondition: '$$item.finishCondition',
                            bulk_card_data: {
                                $arrayElemAt: [
                                    {
                                        $filter: {
                                            input: '$scryfall_cards',
                                            as: 'card',
                                            cond: {
                                                $eq: ['$$item.id', '$$card.id'],
                                            },
                                        },
                                    },
                                    0,
                                ],
                            },
                        },
                    },
                },
            });

        const received = results[0];

        // If there are results, then iterate over them and transform
        const received_cards = received
            ? received.received_cards.map((card) => ({
                  ...card,
                  // Transform all bulk cards in the received list
                  bulk_card_data: new ScryfallApiCard(card.bulk_card_data),
              }))
            : [];

        return { ...received, received_cards };
    } catch (e) {
        throw e;
    }
}

export default getReceivingById;
