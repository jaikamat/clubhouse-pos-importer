/**
 * This function is a helper for Axios, it yields an object for Axios params
 */
export default function makeAuthHeader() {
    const header = {
        Authorization: `Bearer ${localStorage.getItem('clubhouse_JWT')}`,
    };
    return header;
}
