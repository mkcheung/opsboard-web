import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import AppRoutes from "./AppRoutes";

vi.mock('../../shared/config/env', () => {
    return {
        readEnv: () => ({
            activeBackendDefault: 'laravel',
            laravelApiBase: 'http://localhost:8010',
            djangoApiBase: 'http://localhost:8001'
        })
    };
});


const dispatchMock = vi.fn();
const appSelectorMock = vi.fn();

vi.mock('../../store/hooks/hooks', () => ({
    useAppDispatch: () => dispatchMock,
    useAppSelector: () => appSelectorMock
}));

test("navigating to /login renders the Login page", () => {
    appSelectorMock.mockResolvedValue('temp');
    render(
        <MemoryRouter initialEntries={["/login"]}>
            <AppRoutes />
        </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: /Opsboard/i })).toBeInTheDocument();
});