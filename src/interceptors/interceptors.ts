import type { AxiosInstance } from "axios";
import {
    clearToken,
    getToken
} from "../shared/auth/token";

export const attachAuthInterceptor = (http: AxiosInstance) => {
    http.interceptors.request.use((config) => {
        const token = getToken();
        if (token) {
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
}

export const attachUnauthorizedInterceptor = (http: AxiosInstance) => {
    http.interceptors.response.use(
        (response) => response,
        (error) => {
            const status = error?.response?.status;

            if (status === 401) {
                clearToken();
                window.dispatchEvent(new Event("opsboard:unauthorized"));
            }

            return Promise.reject(error);
        }
    );
};