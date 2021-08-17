import { ClubhouseLocation, Collection } from '../common/types';
import { GetCardsByFilterQuery } from '../controllers/getCardsByFilterController';
import getDatabaseConnection from '../database';
import collectionFromLocation from '../lib/collectionFromLocation';
const LIMIT = 100;

/**
 * Uses the Mongo Aggregation Pipeline to gather relevant cards in an itemized list
 *
 * @param {Object} param0 Object with multiple optional properties:
 * title - name of the card
 * setName - the full name of the set
 * format - format in which the card is legal
 * maxPrice - maximum queryable card price
 * minPrice - minimum queryable card price
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
        finish,
        colors,
        sortBy,
        sortByDirection,
        colorSpecificity,
        page,
        type,
        frame,
        maxPrice,
        minPrice,
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

        // Attach bulk card information
        aggregation.push({
            $lookup: {
                from: Collection.scryfallBulkCards,
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

        const nameMatch = { name: { $regex: `${title}`, $options: 'i' } };
        const setNameMatch = { set_name: setName };
        const typeMatch = { type_line: { $regex: `${type}`, $options: 'i' } };
        const borderMatch = { border_color: 'borderless' };
        const showcaseMatch = { frame_effects: 'showcase' };
        const extendedArtMatch = { frame_effects: 'extendedart' };

        if (title) aggregation.push({ $match: nameMatch });
        if (setName) aggregation.push({ $match: setNameMatch });
        if (type) aggregation.push({ $match: typeMatch });
        if (frame === 'borderless') aggregation.push({ $match: borderMatch });
        if (frame === 'showcase') aggregation.push({ $match: showcaseMatch });
        if (frame === 'extendedArt')
            aggregation.push({ $match: extendedArtMatch });

        // Pre-unwind, we add these fields
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

        // Always ensure results are in stock
        aggregation.push({
            $match: { [`inventory.v`]: { $gt: 0 } },
        });

        // Post-unwind, we add estimated pricing from Sryfall
        aggregation.push({
            $addFields: {
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
                colors_string_length: { $strLenCP: '$colors_string' },
            },
        });

        // End match foiling logic
        if (finish === 'FOIL') {
            aggregation.push({
                $match: {
                    'inventory.k': {
                        $in: ['FOIL_NM', 'FOIL_LP', 'FOIL_MP', 'FOIL_HP'],
                    },
                },
            });
        } else if (finish === 'NONFOIL') {
            aggregation.push({
                $match: {
                    'inventory.k': {
                        $in: [
                            'NONFOIL_NM',
                            'NONFOIL_LP',
                            'NONFOIL_MP',
                            'NONFOIL_HP',
                        ],
                    },
                },
            });
        }

        // End match format legality logic
        if (format) {
            aggregation.push({
                $match: {
                    [`legalities.${format}`]: { $in: ['restricted', 'legal'] },
                },
            });
        }

        // End match colors matching logic
        if (colors) {
            aggregation.push({
                $match: { colors_string: colors },
            });
        }

        // Match monocolor, multicolor, or colorless
        if (colorSpecificity) {
            if (colorSpecificity === 'colorless') {
                aggregation.push({
                    $match: { colors_string_length: { $eq: 0 } },
                });
            }
            if (colorSpecificity === 'mono') {
                aggregation.push({
                    $match: { colors_string_length: { $eq: 1 } },
                });
            }
            if (colorSpecificity === 'multi') {
                aggregation.push({
                    $match: { colors_string_length: { $gt: 1 } },
                });
            }
        }

        // Price filtering logic
        if (maxPrice) {
            aggregation.push({
                $match: { price: { $lte: maxPrice } },
            });
        }

        if (minPrice) {
            aggregation.push({
                $match: { price: { $gte: minPrice } },
            });
        }

        // Add sane inventory fields
        aggregation.push({
            $addFields: {
                finishCondition: `$inventory.k`,
                quantityInStock: `$inventory.v`,
            },
        });

        /**
         * Pare down response objects and sculpt them
         *
         * Based on runtime experiments, this substantially cuts down the time
         * it takes for the following $sort stage to execute.
         */
        aggregation.push({
            $project: {
                _id: 1,
                image_uri: 1,
                name: 1,
                price: 1,
                rarity: 1,
                set: 1,
                set_name: 1,
                finishCondition: 1,
                quantityInStock: 1,
            },
        });

        /**
         * TODO: This sort is what affects query runtime the most.
         *
         * It's having to scan all virtualized, unwound entries in memory. There's no clean way to
         * presort this without first performing an $unwind, which is irritating.
         */
        aggregation.push({
            $sort: { [sortBy]: sortByDirection },
        });

        aggregation.push({
            $facet: {
                cards: [{ $skip: SKIP }, { $limit: LIMIT }],
                total_count: [{ $count: 'num' }],
            },
        });

        const docs = await collection
            .aggregate(aggregation, { allowDiskUse: true })
            .toArray();

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
