/**
 * If we set our environment to 'development', return accordingly
 */
const getEnv = (): boolean => {
    if (process.env.ENVIRONMENT) {
        return process.env.ENVIRONMENT === 'development';
    }
    return false;
};

export default getEnv;
