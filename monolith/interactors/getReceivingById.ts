import { ObjectID } from 'mongodb';
import mongoose from 'mongoose';
import { ScryfallApiCard } from '../common/ScryfallApiCard';
import { ClubhouseLocation, Collection } from '../common/types';
import collectionFromLocation from '../lib/collectionFromLocation';

async function getReceivingById(id: string, location: ClubhouseLocation) {
    try {
        const db = await mongoose.connection.db;
        const collection = collectionFromLocation(location).receivedCards;

        let aggregation = [];

        const match = { _id: new ObjectID(id) };

        const addFields = {
            created_at: {
                $toDate: '$_id',
            },
            /** Convert to ObjectId for proper $lookup types */
            user_id: {
                $toObjectId: '$created_by',
            },
        };

        /**
         * We zip up bulk card data here and alias it
         * to `scryfall_cards` for downstream use.
         */
        const bulkLookup = {
            from: Collection.scryfallBulkCards,
            localField: 'received_card_list.id',
            foreignField: 'id',
            as: 'scryfall_cards',
        };

        /**
         * Join users into the aggregation and replace created_by with user entity
         */
        const userLookup = {
            from: collectionFromLocation(location).users,
            localField: 'user_id',
            foreignField: '_id',
            as: 'created_by',
        };

        const project = {
            created_at: 1,
            created_by: {
                $first: '$created_by',
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
                            $first: {
                                $filter: {
                                    input: '$scryfall_cards',
                                    as: 'card',
                                    cond: {
                                        $eq: ['$$item.id', '$$card.id'],
                                    },
                                },
                            },
                        },
                    },
                },
            },
        };

        aggregation.push({ $match: match });
        aggregation.push({ $addFields: addFields });
        aggregation.push({ $lookup: bulkLookup });
        aggregation.push({ $lookup: userLookup });
        aggregation.push({ $project: project });

        const doc = await db
            .collection(collection)
            .aggregate(aggregation)
            .toArray();

        const received = doc[0];

        return {
            ...received,
            received_cards: received.received_cards.map((r) => ({
                ...r,
                // Transform all bulk cards in the received list
                bulk_card_data: new ScryfallApiCard(r.bulk_card_data),
            })),
        };
    } catch (e) {
        throw e;
    }
}

export default getReceivingById;
