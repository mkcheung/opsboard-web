import axios from 'axios';
import { getApiBaseUrl } from '../config/backend';

export const http = axios.create({ baseURL: getApiBaseUrl() })

export const syncHttpBaseUrl = () => { http.defaults.baseURL = getApiBaseUrl() }