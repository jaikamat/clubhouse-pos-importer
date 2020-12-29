import isDev from './assertEnv';

const TEST_NAME: string = 'test';
const PRODUCTION_NAME: string = 'clubhouse_collection_production';

const getDatabaseName = (): string => {
    if (isDev()) return TEST_NAME;
    return PRODUCTION_NAME;
};

export default getDatabaseName;
