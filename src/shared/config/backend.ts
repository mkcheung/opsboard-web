import { readEnv } from './env'

export type Backend = 'laravel' | 'django';

const STORAGE_KEY = 'opsboard.activeBackend';

const isBackend = (value: unknown): value is Backend => {
    return value === 'laravel' || value === 'django'
}

export const setActiveBackend = (next: Backend) => {
    localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new Event("opsboard:backend-changed"));
}

export const getActiveBackend = (): Backend => {

    const stored = localStorage.getItem(STORAGE_KEY);
    if (isBackend(stored)) {
        return stored;
    }

    const envValue = readEnv().activeBackendDefault;
    if (isBackend(envValue)) {
        return envValue;
    }
    return 'laravel';
}

export const getApiBaseUrl = (): string => {
    const backend = getActiveBackend();
    const env = readEnv();
    const base = backend === 'laravel' ? env.laravelApiBase : env.djangoApiBase;

    if (!base || typeof base !== 'string') {
        throw new Error(
            `Missing API base for backend "${backend}". ` +
            `Check VITE_LARAVEL_API_BASE / VITE_DJANGO_API_BASE in env.`
        )
    }
    return base;
}