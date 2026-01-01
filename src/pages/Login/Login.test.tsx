import { expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import { authActions } from "../../store/auth/authSlice";
import Login from "./Login";

const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<any>('react-router-dom');
    return { ...actual, useNavigate: () => navigateMock }
});

vi.mock('../../shared/api/http', () => {
    return {
        http: {
            post: vi.fn(),
        }
    }
})

const mockApiBase = 'temp';
vi.mock('../../shared/config/backend', () => {
    return {
        getActiveBackend: () => mockApiBase,
        getApiBaseUrl: () => mockApiBase
    }
});

const dispatchMock = vi.fn();
const appSelectorMock = vi.fn();
let mockStatus = "unauthenticated";
vi.mock('../../store/hooks/hooks', () => ({
    useAppDispatch: () => dispatchMock,
    useAppSelector: (selector: any) => selector({ auth: { status: mockStatus } }),
}));
afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    mockStatus = "unauthenticated";
});

test("test successful login", async () => {
    appSelectorMock.mockReturnValueOnce("unauthenticated");
    const { rerender } = render(<Login />);

    await userEvent.type(screen.getByLabelText(/email/i), 'test@test.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'testpassword');
    await userEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(dispatchMock).toHaveBeenCalledWith(
        authActions.loginRequested({ email: "test@test.com", password: "testpassword" })
    );
    mockStatus = "authenticated";
    rerender(<Login />);
    await waitFor(() => {
        expect(navigateMock).toHaveBeenCalledWith("/dashboard", { replace: true });
    });
});

test("test unsuccessful login", async () => {
    appSelectorMock.mockReturnValueOnce("unauthenticated");
    const { rerender } = render(<Login />);

    await userEvent.type(screen.getByLabelText(/email/i), 'test@test.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'testpassword');
    await userEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(dispatchMock).toHaveBeenCalledWith(
        authActions.loginRequested({ email: "test@test.com", password: "testpassword" })
    );
    rerender(<Login />);
    await waitFor(() => {
        expect(navigateMock).not.toHaveBeenCalledWith("/dashboard", { replace: true });
    });
});