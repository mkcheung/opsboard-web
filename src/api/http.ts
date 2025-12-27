import axios from 'axios';
import { getApiBaseUrl } from '../config/backend';
import {
    attachAuthInterceptor,
    attachUnauthorizedInterceptor
} from '../interceptors/interceptors';

export const http = axios.create({ baseURL: getApiBaseUrl() })
attachAuthInterceptor(http);
attachUnauthorizedInterceptor(http);

export const syncHttpBaseUrl = () => { http.defaults.baseURL = getApiBaseUrl() }