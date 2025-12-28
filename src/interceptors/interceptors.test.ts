import { describe, it, expect, beforeEach, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
    getToken: vi.fn(),
}));


vi.mock('../auth/token', () => {
    return {
        getToken: mocks.getToken,
    }
});

import { attachAuthInterceptor } from "./interceptors";

beforeEach(() => {
    mocks.getToken.mockReset();
});


describe('test interceptors', () => {
    it('test auth interceptor with token', () => {
        mocks.getToken.mockReturnValue("authtokenvalue");
        let capturedInterceptor: (config: any) => any = () => undefined;
        // mimic shape of AxiosInstance
        const http = {
            interceptors: {
                request: {
                    use: (fn: any) => {
                        capturedInterceptor = fn
                    }
                }
            },
        } as any;
        attachAuthInterceptor(http);
        const config: any = { headers: undefined };
        const result = capturedInterceptor(config);
        expect(result.headers.Authorization).toBe("Bearer authtokenvalue");
    });
    it('test auth interceptor without token', () => {
        mocks.getToken.mockReturnValue(null);
        let capturedInterceptor: (config: any) => any = () => undefined;
        // mimic shape of AxiosInstance
        const http = {
            interceptors: {
                request: {
                    use: (fn: any) => {
                        capturedInterceptor = fn
                    }
                }
            },
        } as any;
        attachAuthInterceptor(http);
        const config: any = { headers: undefined };
        const result = capturedInterceptor(config);
        expect(result.headers).toBeUndefined();
    });
})