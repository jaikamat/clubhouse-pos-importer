const isDev = require('./assertEnv');

const TEST_NAME = 'test';
const PRODUCTION_NAME = 'clubhouse_collection_production';

const fetchDbName = () => {
    if (isDev()) return TEST_NAME;
    return PRODUCTION_NAME;
};

module.exports = fetchDbName;
