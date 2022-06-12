import ScryfallCardModel from '../models/ScryfallCardModel';

/**
 * Sorts and manipulates the resultant autocomplete data
 */
const curateResults = (data: { name: string }[]) => {
    return (
        data
            .map((r) => r.name)
            .sort((a, b) => a.length - b.length) // Sort by length
            .slice(0, 10) // Clamp the result set
            // Ensure the term is in the resultant terms
            .filter((el, idx, arr) => arr.indexOf(el) === idx)
    );
};

async function autocomplete(term: string) {
    try {
        const results = await ScryfallCardModel.aggregate()
            .search({
                index: 'autocomplete',
                autocomplete: {
                    query: term,
                    path: 'name',
                    tokenOrder: 'sequential',
                    fuzzy: {
                        maxEdits: 1,
                        maxExpansions: 50,
                        prefixLength: 3,
                    },
                },
            })
            .project({ _id: 0, name: 1 });

        return curateResults(results);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export default autocomplete;
