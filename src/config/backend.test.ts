import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getActiveBackend, getApiBaseUrl } from "./backend";

const STORAGE_KEY = "opsboard.activeBackend";
let envState: {
    activeBackendDefault?: unknown;
    laravelApiBase?: unknown;
    djangoApiBase?: unknown;
};

vi.mock('./env', () => {
    return {
        readEnv: () => envState,
    };
});

beforeEach(() => {
    localStorage.clear();

    envState = {
        activeBackendDefault: undefined,
        laravelApiBase: "http://laravel.test",
        djangoApiBase: "http://django.test",
    };

    vi.clearAllMocks()
});

describe('getActiveBackend', () => {
    it('returns correct backend based on localStorage - localStorage: laravel', () => {
        localStorage.setItem(STORAGE_KEY, 'laravel');
        envState.activeBackendDefault = 'django';
        expect(getActiveBackend()).toBe('laravel');
    });

    it('returns correct backend based on localStorage - localStorage: django', () => {
        localStorage.setItem(STORAGE_KEY, 'django');
        envState.activeBackendDefault = 'laravel';
        expect(getActiveBackend()).toBe('django');
    });

    it('returns activeBackend when localStorage missing', () => {
        envState.activeBackendDefault = 'laravel';
        expect(getActiveBackend()).toBe('laravel');
    });
});

describe('getApiBaseUrl', () => {
    it('test laravel as active backend', () => {
        envState.activeBackendDefault = 'laravel';
        expect(getApiBaseUrl()).toBe(envState.laravelApiBase);
    });
    it('test django as active backend', () => {
        envState.activeBackendDefault = 'django';
        expect(getApiBaseUrl()).toBe(envState.djangoApiBase);
    });
    it('unavailable base throws exception', () => {
        envState.activeBackendDefault = 'django';
        envState.djangoApiBase = 1234;
        expect(() => getApiBaseUrl()).toThrowError(
            /Missing API base for backend "django"/
        );
    });
})

