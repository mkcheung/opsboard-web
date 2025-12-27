import axios from 'axios';
import { getApiBaseUrl } from '../config/backend';
import { attachAuthInterceptor } from './auth';

export const http = axios.create({ baseURL: getApiBaseUrl() })
attachAuthInterceptor(http);
export const syncHttpBaseUrl = () => { http.defaults.baseURL = getApiBaseUrl() }