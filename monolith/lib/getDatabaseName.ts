const TEST_NAME: string = 'test';
const PRODUCTION_NAME: string = 'clubhouse_collection_production';
const LOCAL_TEST_NAME: string = 'localtest';

const getDatabaseName = (): string => {
    if (process.env.ENVIRONMENT && process.env.ENVIRONMENT === 'localtest') {
        return LOCAL_TEST_NAME;
    } else if (
        process.env.ENVIRONMENT &&
        process.env.ENVIRONMENT === 'development'
    ) {
        return TEST_NAME;
    } else {
        return PRODUCTION_NAME;
    }
};

export default getDatabaseName;
