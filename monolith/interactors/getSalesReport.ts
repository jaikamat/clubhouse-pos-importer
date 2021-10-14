import RawScryfallCard from '../common/RawScryfallCard';
import {
    ClubhouseLocation,
    Collection,
    Finish,
    FinishCondition,
    QOH,
} from '../common/types';
import getDatabaseConnection from '../database';
import collectionFromLocation from '../lib/collectionFromLocation';
import parseQoh from '../lib/parseQoh';
import sum from '../lib/sum';
import getCardsWithInfo from './getCardsWithInfo';

/**
 * Extracts finish from a given finishCondition string
 */
function pluckFinish(finishCondition: FinishCondition): Finish {
    return finishCondition.split('_')[0] as Finish;
}

/**
 * Given a finish, returns the associated quantity
 */
function quantityFromFinish(finish: Finish, qoh: QOH): number {
    const { foilQty, nonfoilQty, etchedQty } = parseQoh(qoh);

    if (finish === 'ETCHED') return etchedQty;
    if (finish === 'FOIL') return foilQty;
    if (finish === 'NONFOIL') return nonfoilQty;
}

/**
 * Given a finish, return the appropriate price from Scryfall data
 */
function priceFromFinish(
    finish: Finish,
    prices: RawScryfallCard['prices']
): number | null {
    // TODO: Etched!
    if (finish === 'ETCHED') return null;
    if (finish === 'FOIL') return Number(prices.usd_foil);
    if (finish === 'NONFOIL') return Number(prices.usd);
}

interface DataPerPrint {
    _id: {
        scryfall_id: string;
        finish_condition: FinishCondition;
    };
    quantity_sold: number;
    card_name: string;
    prices: RawScryfallCard['prices'];
    quantity_on_hand: QOH;
    set_name: string;
}

interface DataPerTitle {
    quantity_sold: number;
    card_name: string;
    total_qoh: number;
}

interface QueryResult {
    dataPerPrinting: Array<DataPerPrint>;
    dataPerTitle: Array<DataPerTitle>;
}

interface Args {
    location: ClubhouseLocation;
    startDate: Date;
    endDate: Date;
}

async function getSalesReport({ location, startDate, endDate }: Args) {
    try {
        const db = await getDatabaseConnection();
        const collection = collectionFromLocation(location).salesData;

        const aggregation = [];

        const unwind = {
            path: '$card_list',
            preserveNullAndEmptyArrays: true,
        };

        const project = {
            created_at: { $toDate: '$_id' },
            scryfall_id: '$card_list.id',
            card_name: '$card_list.name',
            quantity_sold: '$card_list.qtyToSell',
            finish_condition: '$card_list.finishCondition',
        };

        const match = {
            created_at: {
                $gte: startDate,
                $lte: endDate,
            },
        };

        const sort = { quantity_sold: -1 };
        const limit = 200;

        const facet = {
            dataPerPrinting: [
                {
                    $group: {
                        _id: {
                            scryfall_id: '$scryfall_id',
                            finish_condition: '$finish_condition',
                        },
                        quantity_sold: { $sum: '$quantity_sold' },
                        card_name: { $first: '$card_name' },
                    },
                },
                { $sort: sort },
                { $limit: limit },
                // Join on bulk cards for metadata
                {
                    $lookup: {
                        from: Collection.scryfallBulkCards,
                        localField: '_id.scryfall_id',
                        foreignField: 'id',
                        as: 'card_metadata',
                    },
                },
                // Join on current inventory for current QOH
                {
                    $lookup: {
                        from: collectionFromLocation(location).cardInventory,
                        localField: '_id.scryfall_id',
                        foreignField: '_id',
                        as: 'inventory',
                    },
                },
                {
                    $addFields: {
                        card_metadata: { $first: '$card_metadata' },
                        inventory: { $first: '$inventory' },
                    },
                },
                {
                    $addFields: {
                        quantity_on_hand: '$inventory.qoh',
                        prices: '$card_metadata.prices',
                        set_name: '$card_metadata.set_name',
                    },
                },
                {
                    $project: {
                        _id: 1,
                        scryfall_id: 1,
                        quantity_sold: 1,
                        card_name: 1,
                        quantity_on_hand: 1,
                        finish: 1,
                        finish_condition: 1,
                        estimated_price: 1,
                        prices: 1,
                        set_name: 1,
                    },
                },
            ],
            dataPerTitle: [
                {
                    $group: {
                        _id: '$card_name',
                        quantity_sold: { $sum: '$quantity_sold' },
                        card_name: { $first: '$card_name' },
                    },
                },
                { $sort: sort },
                { $limit: limit },
                {
                    $project: {
                        _id: 1,
                        quantity_sold: 1,
                        card_name: 1,
                    },
                },
            ],
        };

        aggregation.push({ $unwind: unwind });
        aggregation.push({ $project: project });
        aggregation.push({ $match: match });
        aggregation.push({ $facet: facet });

        const doc = await db
            .collection(collection)
            .aggregate(aggregation)
            .toArray();

        const result: QueryResult = doc[0];

        // Map all in-stock cards by title
        const cardsFromTitleWithQoh = result.dataPerTitle.map(async (dpt) => {
            const { card_name } = dpt;

            const cardsWithMeta = await getCardsWithInfo(
                card_name,
                true,
                location
            );

            // Combine the aggregated metadata with qoh for all cards that match the title
            return {
                ...dpt,
                total_qoh: sum(
                    cardsWithMeta.map((cwm) => {
                        const { foilQty, nonfoilQty, etchedQty } = parseQoh(
                            cwm.qoh
                        );

                        return foilQty + nonfoilQty + etchedQty;
                    })
                ),
            };
        });

        const promisedCardsFromTitleWithQoh = await Promise.all(
            cardsFromTitleWithQoh
        );

        /**
         * Transform the data with a custom _id for client use and
         * and infer quantity on hand for the indicated finish_condition
         */
        const cardsFromPrinting = result.dataPerPrinting.map((c) => {
            const id = `${c._id.scryfall_id}-${c._id.finish_condition}`;
            const finish = pluckFinish(c._id.finish_condition);

            return {
                ...c,
                _id: id,
                scryfall_id: c._id.scryfall_id,
                finish_condition: c._id.finish_condition,
                finish: finish,
                quantity_on_hand: quantityFromFinish(
                    finish,
                    c.quantity_on_hand
                ),
                estimated_price: priceFromFinish(finish, c.prices),
            };
        });

        return {
            dataPerPrinting: cardsFromPrinting,
            dataPerTitle: promisedCardsFromTitleWithQoh,
        };
    } catch (e) {
        throw e;
    }
}

export default getSalesReport;
