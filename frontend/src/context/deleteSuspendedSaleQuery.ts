import http from '../common/http';
import { SUSPEND_SALE } from '../utils/api_resources';

const deleteSuspendedSaleQuery = async (saleId: string) => {
    try {
        const { data } = await http.delete<void>(`${SUSPEND_SALE}/${saleId}`);
        return data;
    } catch (err) {
        throw err;
    }
};

export default deleteSuspendedSaleQuery;
