import axios, { AxiosRequestConfig } from 'axios';
import makeAuthHeader from '../utils/makeAuthHeader';

const instance = axios.create();

instance.interceptors.request.use((config: AxiosRequestConfig) => {
    config.headers = makeAuthHeader();
    return config;
});

export default instance;
