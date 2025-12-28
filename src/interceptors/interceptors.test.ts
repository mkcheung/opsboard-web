import { describe, it, expect, beforeEach, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
    getToken: vi.fn(),
    clearToken: vi.fn(),
}));


vi.mock('../auth/token', () => {
    return {
        getToken: mocks.getToken,
        clearToken: mocks.clearToken,
    }
});

import {
    attachAuthInterceptor,
    attachUnauthorizedInterceptor
} from "./interceptors";

beforeEach(() => {
    mocks.getToken.mockReset();
});


describe('test auth interceptor', () => {
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
});



describe('test unauthorized interceptor', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('test 401 unauthorized', async () => {
        const dispatchSpy = vi.spyOn(window, "dispatchEvent");
        let capturedErrorHandler: (err: any) => any = () => undefined;

        const http = {
            interceptors: {
                response: {
                    use: (_onSuccess: any, onError: any) => {
                        capturedErrorHandler = onError;
                    },
                },
            },
        } as any;
        attachUnauthorizedInterceptor(http);
        const err401 = { response: { status: 401 } };
        await expect(capturedErrorHandler(err401)).rejects.toBe(err401);
        expect(mocks.clearToken).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Event));
        expect(dispatchSpy.mock.calls[0][0].type).toBe("opsboard:unauthorized");
        dispatchSpy.mockRestore();
    });
});