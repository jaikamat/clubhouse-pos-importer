import axios from 'axios';
import makeAuthHeader from '../utils/makeAuthHeader';
import { SUSPEND_SALE } from '../utils/api_resources';
import { SuspendedSale } from '../context/getSuspendedSaleQuery';

const getSuspendedSalesQuery = async () => {
    try {
        const { data } = await axios.get<SuspendedSale[]>(SUSPEND_SALE, {
            headers: makeAuthHeader(),
        });

        return data;
    } catch (err) {
        throw err;
    }
};

export default getSuspendedSalesQuery;
