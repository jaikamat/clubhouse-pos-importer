/**
 * If we set our environment to 'development', return accordingly
 */
const isDev = () => {
    if (process.env.ENVIRONMENT) {
        return process.env.ENVIRONMENT === 'development';
    }
    return false;
};

export default isDev;
