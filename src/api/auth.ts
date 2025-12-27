import type { AxiosInstance } from "axios";
import { getToken } from "../auth/token";

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