import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Loading from '../ui/Loading';
import reportingQuery, { ResponseData } from './reportingQuery';

interface SearchDates {
    startDate: string;
    endDate: string;
}

const allTimeDates: SearchDates = {
    startDate: moment().year(1999).toISOString(),
    endDate: moment().toISOString(),
};

const lastMonthDates: SearchDates = {
    startDate: moment().subtract(30, 'days').toISOString(),
    endDate: moment().toISOString(),
};

const Reporting = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [report, setReport] = useState<ResponseData | null>(null);
    const [searchDates, setSearchDates] = useState<SearchDates>(allTimeDates);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const data = await reportingQuery(searchDates);
            setLoading(false);
            setReport(data);
        })();
    }, [searchDates]);

    return (
        <div>
            <button onClick={() => setSearchDates(allTimeDates)}>
                All time
            </button>
            <button onClick={() => setSearchDates(lastMonthDates)}>
                last 30 days
            </button>
            {loading ? (
                <Loading />
            ) : (
                <pre>{JSON.stringify(report, null, 2)}</pre>
            )}
        </div>
    );
};

export default Reporting;
