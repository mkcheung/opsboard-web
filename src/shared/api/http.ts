import axios from 'axios';
import {
    getActiveBackend,
    getApiBaseUrl
} from '../config/backend';
import {
    attachAuthInterceptor,
    attachUnauthorizedInterceptor
} from '../../interceptors/interceptors';

export const http = axios.create({ baseURL: getApiBaseUrl() })
attachAuthInterceptor(http);
attachUnauthorizedInterceptor(http);

export const syncHttpBaseUrl = () => { http.defaults.baseURL = getApiBaseUrl() }

export function setAuthToken(token: string | null) {
    if (token) {
        http.defaults.headers.common["Authorization"] = `${getActiveBackend() == 'django' ? 'Token' : 'Bearer'} ${token}`;
    } else {
        delete http.defaults.headers.common["Authorization"];
    }
}