import { ScryfallApiCard } from '../common/ScryfallApiCard';
import { ClubhouseLocation, QOH } from '../common/types';
import getInventoryCardModel from '../models/InventoryCardModel';
import ScryfallCardModel from '../models/ScryfallCardModel';
import { ScryfallCard } from '../schemas/ScryfallCardSchema';

type ReturnCard = ScryfallApiCard & { qoh: QOH };
type AggregateCard = ScryfallCard & { qoh?: QOH };

/**
 * Transform the bulk cards and reattach existing QOH.
 *
 * QOH may not exist yet if a card is not in inventory, so we need to add it.
 */
const transformAggregateCard = (card: AggregateCard): ReturnCard => {
    return {
        ...new ScryfallApiCard(card),
        qoh: card.qoh ? card.qoh : {},
    };
};

async function getCardsWithInfo(
    title: string,
    // if matchInStock is false, we get all cards, even those with no stock
    matchInStock: boolean = false,
    location: ClubhouseLocation
): Promise<ReturnCard[]> {
    try {
        const results = await ScryfallCardModel.aggregate<AggregateCard>()
            .match({
                name: title,
                $or: [
                    /**
                     * Some cards with _no_ `games` array, we want to include
                     *
                     * ex. World Championship cards, and freshly-added cards are in this list
                     */
                    {
                        'games.0': { $exists: false },
                    },
                    /**
                     * We also want to include cards that, if they _do_ have a `games` array,
                     * include "paper" as a game type
                     */
                    {
                        games: { $in: ['paper'] },
                    },
                ],
            })
            .lookup({
                from: getInventoryCardModel(location).collection.name,
                localField: 'id',
                foreignField: '_id',
                as: 'qoh',
            })
            .addFields({
                qoh: { $arrayElemAt: ['$qoh.qoh', 0] },
            })
            .match(
                matchInStock
                    ? {
                          $or: [
                              { 'qoh.FOIL_NM': { $gt: 0 } },
                              { 'qoh.FOIL_LP': { $gt: 0 } },
                              { 'qoh.FOIL_MP': { $gt: 0 } },
                              { 'qoh.FOIL_HP': { $gt: 0 } },
                              { 'qoh.NONFOIL_NM': { $gt: 0 } },
                              { 'qoh.NONFOIL_LP': { $gt: 0 } },
                              { 'qoh.NONFOIL_MP': { $gt: 0 } },
                              { 'qoh.NONFOIL_HP': { $gt: 0 } },
                              { 'qoh.ETCHED_NM': { $gt: 0 } },
                              { 'qoh.ETCHED_LP': { $gt: 0 } },
                              { 'qoh.ETCHED_MP': { $gt: 0 } },
                              { 'qoh.ETCHED_HP': { $gt: 0 } },
                          ],
                      }
                    : {}
            );

        return results.map(transformAggregateCard);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export default getCardsWithInfo;
