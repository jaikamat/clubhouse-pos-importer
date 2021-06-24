/**
 * Used for old entities did not have certain fields
 */
const displayEmpty = (str: string | null): string => {
    return str ? str : '—';
};

export default displayEmpty;
