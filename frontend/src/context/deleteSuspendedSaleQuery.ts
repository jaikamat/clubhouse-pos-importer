import axios from 'axios';
import makeAuthHeader from '../utils/makeAuthHeader';
import { SUSPEND_SALE } from '../utils/api_resources';

const deleteSuspendedSaleQuery = async (saleId: string) => {
    try {
        const { data } = await axios.delete<void>(`${SUSPEND_SALE}/${saleId}`, {
            headers: makeAuthHeader(),
        });
        return data;
    } catch (err) {
        throw err;
    }
};

export default deleteSuspendedSaleQuery;
