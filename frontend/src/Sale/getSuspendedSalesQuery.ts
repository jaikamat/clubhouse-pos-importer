import axios from 'axios';
import { SuspendedSale } from '../context/getSuspendedSaleQuery';
import { SUSPEND_SALE } from '../utils/api_resources';
import makeAuthHeader from '../utils/makeAuthHeader';

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
