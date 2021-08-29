import axios, { AxiosRequestConfig } from 'axios';
import makeAuthHeader from '../utils/makeAuthHeader';

const http = axios.create();

/**
 * This is essentially Axios middleware that sets the header prior to
 * continuing the request pipeline
 */
http.interceptors.request.use((config: AxiosRequestConfig) => {
    config.headers = makeAuthHeader();
    return config;
});

export default http;
