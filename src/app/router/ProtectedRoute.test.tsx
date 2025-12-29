import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from "@testing-library/react";
import ProtectedRoute from "./ProtectedRoute";

const mocks = vi.hoisted(() => ({
    getToken: vi.fn(),
}));
vi.mock('../../shared/auth/token', () => {
    getToken: vi.fn()
    return {
        getToken: mocks.getToken,
    }
});

beforeEach(() => {
    mocks.getToken.mockReset();
});

const locationMock = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<any>("react-router-dom");
    return {
        ...actual,
        useLocation: () => locationMock(),
        Navigate: (props: any) => (
            <div data-testid="navigate" data-props={JSON.stringify(props)} />
        ),
    };
});

test("test successful register and render children", async () => {
    mocks.getToken.mockReturnValue("temp");
    locationMock.mockReturnValue('temporary');
    render(<ProtectedRoute>
        <div>Secret</div>
    </ProtectedRoute>);
    expect(screen.getByText("Secret")).toBeInTheDocument();
    expect(screen.queryByTestId("navigate")).toBeNull();
});

test("test poor register and navigate to login", async () => {
    mocks.getToken.mockReturnValue(null);
    locationMock.mockReturnValue('dashboard');
    render(<ProtectedRoute>
        <div>Secret</div>
    </ProtectedRoute>);
    expect(screen.queryByText("Secret")).toBeNull();
    const nav = screen.getByTestId("navigate");
    const props = JSON.parse(nav.getAttribute("data-props")!);

    expect(props.to).toBe("/login");
    expect(props.replace).toBe(true);
    expect(props.state).toEqual({ from: 'dashboard' });
});