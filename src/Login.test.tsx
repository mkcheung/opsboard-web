import { expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import { http } from "./api/http";
import Login from "./Login";
import { getApiBaseUrl } from "./config/backend";

const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<any>('react-router-dom');
    return { ...actual, useNavigate: () => navigateMock }
});

const setTokenMock = vi.fn();
vi.mock('./auth/token', async () => {
    return {
        setToken: (...args: any[]) => setTokenMock(...args)
    }
});

vi.mock('./api/http', () => {
    return {
        http: {
            post: vi.fn(),
        }
    }
})

const mockApiBase = 'temp';
vi.mock('./config/backend', () => {
    return {
        getActiveBackend: () => mockApiBase,
        getApiBaseUrl: () => mockApiBase
    }
});

afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
});

test("test successful login", async () => {
    (http.post as any).mockResolvedValue({
        status: 200,
        data: {
            token: 'testtoken'
        }
    });
    render(<Login />);

    await userEvent.type(screen.getByLabelText(/email/i), 'test@test.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'testpassword');
    await userEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(http.post).toHaveBeenCalledWith(
        `${mockApiBase}/api/auth/login`,
        expect.objectContaining({
            email: 'test@test.com',
            password: 'testpassword'
        })
    );
    expect(setTokenMock).toHaveBeenCalledWith('testtoken');
    expect(navigateMock).toHaveBeenCalledWith('/dashboard');
});

test("test unsuccessful login", async () => {
    (http.post as any).mockResolvedValue({
        status: 500,
        data: {
            token: 'testtoken'
        }
    });

    const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => { });


    render(<Login />);

    await userEvent.type(screen.getByLabelText(/email/i), 'test@test.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'testpassword');
    await userEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(http.post).toHaveBeenCalledWith(
        `${mockApiBase}/api/auth/login`,
        expect.objectContaining({
            email: 'test@test.com',
            password: 'testpassword'
        })
    );
    expect(setTokenMock).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()
    expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Login Failed - please try again"
    );
    consoleErrorSpy.mockRestore();
});

test("test failed login call", async () => {
    (http.post as any).mockRejectedValueOnce(new Error('malfunction'));

    const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => { });


    render(<Login />);

    await userEvent.type(screen.getByLabelText(/email/i), 'test@test.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'testpassword');
    await userEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(http.post).toHaveBeenCalledWith(
        `${mockApiBase}/api/auth/login`,
        expect.objectContaining({
            email: 'test@test.com',
            password: 'testpassword'
        })
    );
    expect(setTokenMock).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()
    expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Login Failed"
    );
    consoleErrorSpy.mockRestore();
});