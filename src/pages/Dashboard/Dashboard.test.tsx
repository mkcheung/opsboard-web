import { expect, vi } from 'vitest';
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from './Dashboard';
import {
    getToken,
} from '../../shared/auth/token';

const mocks = vi.hoisted(() => ({
    getApiBaseUrl: vi.fn(),
}));

const navigateMock = vi.fn();
const dispatchMock = vi.fn();

vi.mock('../../shared/config/backend', () => ({
    getApiBaseUrl: () => mocks.getApiBaseUrl
}));

vi.mock('../../store/hooks/hooks', () => ({
    useAppDispatch: () => dispatchMock
}));

vi.mock("../../shared/api/http", () => {
    return {
        http: {
            post: vi.fn(),
        },
    };
});


vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<any>('react-router-dom');
    return { ...actual, useNavigate: () => navigateMock }
});

test('User has been logged out', async () => {
    render(<Dashboard />);
    await userEvent.click(screen.getByRole("button", { name: /logout/i }));
    expect(getToken()).toBeNull();
    expect(navigateMock).toHaveBeenCalledWith('/login');
});

test('Logout call error', async () => {

    render(<Dashboard />);
    await userEvent.click(screen.getByRole("button", { name: /logout/i }));
    expect(navigateMock).toHaveBeenCalledWith('/login');

});