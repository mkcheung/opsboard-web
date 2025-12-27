import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import AppRoutes from "./AppRoutes";

vi.mock('./config/env', () => {
    return {
        readEnv: () => ({
            activeBackendDefault: 'laravel',
            laravelApiBase: 'http://localhost:8010',
            djangoApiBase: 'http://localhost:8001'
        })
    };
});

test("navigating to /login renders the Login page", () => {
    render(
        <MemoryRouter initialEntries={["/login"]}>
            <AppRoutes />
        </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /Opsboard/i })).toBeInTheDocument();
});