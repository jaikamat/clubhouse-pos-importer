import http from '../common/http';
import { SuspendedSale } from '../context/getSuspendedSaleQuery';
import { SUSPEND_SALE } from '../utils/endpoints';

const getSuspendedSalesQuery = async () => {
    try {
        const { data } = await http.get<SuspendedSale[]>(SUSPEND_SALE);

        return data;
    } catch (err) {
        throw err;
    }
};

export default getSuspendedSalesQuery;
