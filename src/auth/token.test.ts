import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
    clearToken,
    getToken,
    setToken
} from './token';


beforeEach(() => {
    localStorage.clear();
});


describe('localstorage authToken setting, retrieval and clearing', () => {
    it('auth token set locally', () => {
        setToken('authToken');
        expect(getToken()).toBe('authToken');
    });
    it('auth token cleared', () => {
        setToken('authToken');
        clearToken();
        expect(getToken()).toBeNull();
    });
});