import { expect, beforeEach, vi } from 'vitest';
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from './Dashboard';
import { http } from "../../shared/api/http";
import {
    getToken,
    setToken
} from '../../shared/auth/token';

const mocks = vi.hoisted(() => ({
    getApiBaseUrl: vi.fn(),
}));


vi.mock('../../shared/config/backend', () => ({
    getApiBaseUrl: () => mocks.getApiBaseUrl
}));


vi.mock("../../shared/api/http", () => {
    return {
        http: {
            post: vi.fn(),
        },
    };
});

beforeEach(() => {
    mocks.getApiBaseUrl.mockReset();
});

const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<any>('react-router-dom');
    return { ...actual, useNavigate: () => navigateMock }
});

test('User has been logged out', async () => {
    setToken('testing123');
    mocks.getApiBaseUrl.mockReturnValue("temp");
    (http.post as any).mockResolvedValue({
        status: 200
    });
    render(<Dashboard />);
    await userEvent.click(screen.getByRole("button", { name: /logout/i }));
    expect(getToken()).toBeNull();
    expect(navigateMock).toHaveBeenCalledWith('/login');
});

test('Logout call error', async () => {
    const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => { });
    setToken('testing123');
    mocks.getApiBaseUrl.mockReturnValue("temp");
    (http.post as any).mockRejectedValueOnce(new Error('malfunction'));
    render(<Dashboard />);
    await userEvent.click(screen.getByRole("button", { name: /logout/i }));

    expect(getToken()).toBeNull();
    expect(navigateMock).toHaveBeenCalledWith('/login');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Logout failed: ",
        expect.objectContaining({ message: "malfunction" })
    );
    consoleErrorSpy.mockRestore();
});