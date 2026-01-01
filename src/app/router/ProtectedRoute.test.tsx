import { expect, beforeEach, vi } from 'vitest';
import { render, screen } from "@testing-library/react";
import ProtectedRoute from "./ProtectedRoute";
import { MemoryRouter, Routes, Route } from "react-router-dom";

const mocks = vi.hoisted(() => ({
    getToken: vi.fn(),
}));
vi.mock('../../shared/auth/token', () => {
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

let mockStatus = "checking";
vi.mock('../../store/hooks/hooks', () => ({
    useAppSelector: (selector: any) => selector({ auth: { status: mockStatus } }),
}));

test("test successful register and render children", async () => {
    mockStatus = 'checking';
    render(
        <MemoryRouter initialEntries={["/dashboard"]}>
            <Routes>
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<div>Secret</div>} />
                </Route>
                <Route path="/login" element={<div>Login</div>} />
            </Routes>
        </MemoryRouter>);
    expect(screen.getByText("...Loading")).toBeInTheDocument();
    expect(screen.queryByText("Secret")).toBeNull();
});

test("test poor register and navigate to login", async () => {
    mockStatus = 'unauthenticated';
    render(<MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<div>...Loading</div>} />
            </Route>
            <Route path="/login" element={<div>Login</div>} />
        </Routes>
    </MemoryRouter>)
    const nav = screen.getByTestId("navigate");
    const props = JSON.parse(nav.getAttribute("data-props")!);

    expect(props.to).toBe("/login");
    expect(props.replace).toBe(true);
});