import { ClubhouseLocation } from '../common/types';
import getDatabaseConnection from '../database';
import collectionFromLocation from '../lib/collectionFromLocation';
import { GetCardsByFilterQuery } from '../routes/auth';
const LIMIT = 100;

/**
 * Uses the Mongo Aggregation Pipeline to gather relevant cards in an itemized list
 *
 * @param {Object} param0 Object with multiple optional properties:
 * title - name of the card
 * setName - the full name of the set
 * format - format in which the card is legal
 * priceNum - the price to query on. Used in conjunciton with priceFilter
 * priceFilter - gt, gte, lt, or lte. Used with Mongo aggregation to find price relations
 * finish - `FOIL` or `NONFOIL`
 * sortBy - `name` or `price`
 * sortByDirection - `1` or `-1`
 * page - used to modify internal SKIP constant for pagination
 * colors - a sorted string, used to identify cards by one or more colors
 * type - the typeline search, like `Artifact` or `Creature`
 * frame - the desired frame effect filter (borderless, extended-art, showcase, etc)
 */
const getCardsByFilter = async (
    {
        title,
        setName,
        format,
        priceNum,
        priceFilter,
        finish,
        colors,
        sortBy,
        sortByDirection,
        colorSpecificity,
        page,
        type,
        frame,
    }: GetCardsByFilterQuery,
    location: ClubhouseLocation
) => {
    try {
        const db = await getDatabaseConnection();

        const collection = db.collection(
            collectionFromLocation(location).cardInventory
        );

        const SKIP = LIMIT * (page - 1); // `page` starts at 1 for clarity

        // Create aggregation
        const aggregation = [];

        // Build the initialMatch
        const initialMatch: { name?: any; set_name?: string } = {};

        if (title) initialMatch.name = { $regex: `${title}`, $options: 'i' };
        if (setName) initialMatch.set_name = setName;

        aggregation.push({ $match: initialMatch });

        // Attach bulk card information
        aggregation.push({
            $lookup: {
                from: 'scryfall_bulk_cards',
                localField: '_id',
                foreignField: 'id',
                as: 'bulk_match',
            },
        });

        // Merge the bulk and pricing collection properties
        aggregation.push({
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: [
                        { $arrayElemAt: ['$bulk_match', 0] },
                        '$$ROOT',
                    ],
                },
            },
        });

        const typeMatch: { type_line?: any } = {};

        // Types are Tribal, Instant, Sorcery, Creature, Enchantment, Land, Planeswalker, Artifact
        if (type) typeMatch.type_line = { $regex: `${type}`, $options: 'i' };

        aggregation.push({ $match: typeMatch });

        const borderMatch: { border_color?: string } = {};
        const showcaseMatch: { frame_effects?: string } = {};
        const extendedArtMatch: { frame_effects?: string } = {};

        // Matches borderless art only
        borderMatch.border_color = 'borderless';

        // Matches extended art cards
        extendedArtMatch.frame_effects = 'extendedart';

        // Matches showcase art cards
        showcaseMatch.frame_effects = 'showcase';

        if (frame === 'borderless') {
            aggregation.push({ $match: borderMatch });
        }

        if (frame === 'extendedArt') {
            aggregation.push({ $match: extendedArtMatch });
        }

        if (frame === 'showcase') {
            aggregation.push({ $match: showcaseMatch });
        }

        const addFields = {
            image_uri: {
                $ifNull: [
                    '$image_uris.normal',
                    {
                        // If the card is a flip card, its image uri will be nested in the card_faces property.
                        // We use the $let operator to evaluate its contents to a temp variable `image` and extract the image_uri
                        $let: {
                            vars: {
                                image: { $arrayElemAt: ['$card_faces', 0] },
                            },
                            in: '$$image.image_uris.normal',
                        },
                    },
                ],
            },
            // NOTE: This is dependent on Scryfall sorting their color arrays in 'BGRUW' order
            colors_string: {
                $ifNull: [
                    {
                        $reduce: {
                            input: '$colors',
                            initialValue: '',
                            in: { $concat: ['$$value', '$$this'] },
                        },
                    },
                    {
                        // If the card is a flip card, its colors will be nested in the card_faces property.
                        // We use the $let operator to evaluate its contents to a temp variable `colors` and extract the colors array
                        $let: {
                            vars: {
                                colors: { $arrayElemAt: ['$card_faces', 0] },
                            },
                            // Here, we concat the array to a single string to $match on a substring
                            in: {
                                $reduce: {
                                    input: '$$colors.colors',
                                    initialValue: '',
                                    in: { $concat: ['$$value', '$$this'] },
                                },
                            },
                        },
                    },
                ],
            },
            inventory: { $objectToArray: '$qoh' },
        };

        aggregation.push({ $addFields: addFields });

        aggregation.push({ $unwind: '$inventory' });

        aggregation.push({
            $project: {
                _id: 1,
                name: 1,
                set_name: 1,
                set: 1,
                inventory: 1,
                price: {
                    $switch: {
                        branches: [
                            {
                                case: { $eq: ['$inventory.k', 'NONFOIL_NM'] },
                                then: '$prices.usd',
                            },
                            {
                                case: { $eq: ['$inventory.k', 'NONFOIL_LP'] },
                                then: '$prices.usd',
                            },
                            {
                                case: { $eq: ['$inventory.k', 'NONFOIL_MP'] },
                                then: '$prices.usd',
                            },
                            {
                                case: { $eq: ['$inventory.k', 'NONFOIL_HP'] },
                                then: '$prices.usd',
                            },
                            {
                                case: { $eq: ['$inventory.k', 'FOIL_NM'] },
                                then: '$prices.usd_foil',
                            },
                            {
                                case: { $eq: ['$inventory.k', 'FOIL_LP'] },
                                then: '$prices.usd_foil',
                            },
                            {
                                case: { $eq: ['$inventory.k', 'FOIL_MP'] },
                                then: '$prices.usd_foil',
                            },
                            {
                                case: { $eq: ['$inventory.k', 'FOIL_HP'] },
                                then: '$prices.usd_foil',
                            },
                        ],
                    },
                },
                image_uri: 1,
                rarity: 1,
                colors_string: 1,
                colors_string_length: { $strLenCP: '$colors_string' },
                legalities: 1,
                type_line: 1,
                prices: 1,
                printed_name: 1,
                flavor_name: 1,
                border_color: 1,
                frame_effects: 1,
            },
        });

        // Building the end match
        const endMatch: {
            colors_string_length?: any;
            colors_string?: string;
            price?: any;
        } = {};

        // End match foiling logic
        if (finish === 'FOIL') {
            endMatch['inventory.k'] = {
                $in: ['FOIL_NM', 'FOIL_LP', 'FOIL_MP', 'FOIL_HP'],
            };
        } else if (finish === 'NONFOIL') {
            endMatch['inventory.k'] = {
                $in: ['NONFOIL_NM', 'NONFOIL_LP', 'NONFOIL_MP', 'NONFOIL_HP'],
            };
        }

        // End match format legality logic
        if (format)
            endMatch[`legalities.${format}`] = { $in: ['restricted', 'legal'] };

        // End match colors matching logic
        if (colors) endMatch.colors_string = colors;

        // Match monocolor, multicolor, or colorless
        if (colorSpecificity) {
            if (colorSpecificity === 'colorless') {
                endMatch.colors_string_length = { $eq: 0 };
            }
            if (colorSpecificity === 'mono') {
                endMatch.colors_string_length = { $eq: 1 };
            }
            if (colorSpecificity === 'multi') {
                endMatch.colors_string_length = { $gt: 1 };
            }
        }

        // Always ensure results are in stock
        endMatch[`inventory.v`] = { $gt: 0 };

        // Price filtering logic
        if (priceNum && priceFilter) {
            endMatch.price = { [`$${priceFilter}`]: priceNum };
        }

        aggregation.push({ $match: endMatch });

        const sortByFilter = {};
        const sortByProp = sortBy;
        const sortByDirectionProp = sortByDirection;
        sortByFilter[sortByProp] = sortByDirectionProp;

        aggregation.push({ $sort: sortByFilter });

        aggregation.push({
            $facet: {
                cards: [{ $skip: SKIP }, { $limit: LIMIT }],
                total_count: [{ $count: 'num' }],
            },
        });

        const docs = await collection.aggregate(aggregation).toArray();

        const output: {
            cards?: any;
            total?: any;
        } = {};

        output.cards = docs[0].cards ? docs[0].cards : [];
        output.total = docs[0].total_count[0] ? docs[0].total_count[0].num : 0;

        return output;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export default getCardsByFilter;
