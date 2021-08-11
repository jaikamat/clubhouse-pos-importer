/**
 * This function is a helper for Axios, it yields an object for Axios params
 */
export default function makeAuthHeader() {
    const item = localStorage.getItem('clubhouse_JWT');

    if (!item) return null;

    return { Authorization: `Bearer ${JSON.parse(item)}` };
}
