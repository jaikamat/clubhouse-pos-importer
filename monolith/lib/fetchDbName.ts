const isDev = require('./assertEnv');

const TEST_NAME: string = 'test';
const PRODUCTION_NAME: string = 'clubhouse_collection_production';

const fetchDbName = (): string => {
    if (isDev()) return TEST_NAME;
    return PRODUCTION_NAME;
};

export default fetchDbName
