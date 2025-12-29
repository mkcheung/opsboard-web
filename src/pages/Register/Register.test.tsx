import { expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import { http } from "../../shared/api/http";
import { Register } from "./Register";

// mock navigate
const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<any>("react-router-dom");
    return { ...actual, useNavigate: () => navigateMock };
});

const setTokenMock = vi.fn();
vi.mock('../../shared/auth/token', () => ({
    setToken: (...args: any[]) => setTokenMock(...args)
}));

vi.mock("../../shared/api/http", () => {
    return {
        http: {
            post: vi.fn(),
        },
    };
});

afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
});

test("test successful register and navigate to login", async () => {
    (http.post as any).mockResolvedValue({
        status: 201,
        data: {
            token: 'sample'
        }
    });
    render(<Register />);

    await userEvent.type(screen.getByLabelText(/name/i), "Mars");
    await userEvent.type(screen.getByLabelText(/email/i), "mars@test.com");
    await userEvent.type(screen.getByLabelText(/^password:\s*$/i), 'password123');
    await userEvent.type(screen.getByLabelText(/confirm/i), 'password123');
    await userEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(http.post).toHaveBeenCalledWith(
        '/api/auth/register',
        expect.objectContaining({
            email: 'mars@test.com'
        })
    );
    expect(setTokenMock).toHaveBeenCalledWith('sample');
    expect(navigateMock).toHaveBeenCalledWith('/login');
});

test("test unsuccessful register and navigate to login", async () => {
    (http.post as any).mockResolvedValue({
        status: 500,
        data: {}
    });

    const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => { });

    render(<Register />);

    await userEvent.type(screen.getByLabelText(/name/i), "Mars");
    await userEvent.type(screen.getByLabelText(/email/i), "mars@test.com");
    await userEvent.type(screen.getByLabelText(/^password:\s*$/i), 'password123');
    await userEvent.type(screen.getByLabelText(/confirm/i), 'password123');
    await userEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(http.post).toHaveBeenCalledWith(
        '/api/auth/register',
        expect.objectContaining({
            email: "mars@test.com",
            password: "password123",
            password_confirm: "password123",
        })
    );
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Error in User Registration Submission');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error in User Registration Submission"
    );
    consoleErrorSpy.mockRestore();
});

test("test invalid emails", async () => {
    (http.post as any).mockResolvedValue({
        status: 500,
        data: {}
    });

    const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => { });

    render(<Register />);

    await userEvent.type(screen.getByLabelText(/name/i), "Mars");
    await userEvent.type(screen.getByLabelText(/email/i), "marstest.com");
    await userEvent.type(screen.getByLabelText(/^password:\s*$/i), 'password1234');
    await userEvent.type(screen.getByLabelText(/confirm/i), 'password1234');
    await userEvent.click(screen.getByRole("button", { name: /submit/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Email format is invalid.');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Email format is invalid."
    );
    consoleErrorSpy.mockRestore();
});

test("test mismatched passwords", async () => {
    (http.post as any).mockResolvedValue({
        status: 500,
        data: {}
    });

    const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => { });

    render(<Register />);

    await userEvent.type(screen.getByLabelText(/name/i), "Mars");
    await userEvent.type(screen.getByLabelText(/email/i), "mars@test.com");
    await userEvent.type(screen.getByLabelText(/^password:\s*$/i), 'improperpw123');
    await userEvent.type(screen.getByLabelText(/confirm/i), 'password1234');
    await userEvent.click(screen.getByRole("button", { name: /submit/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Passwords must match.');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Passwords must match."
    );
    consoleErrorSpy.mockRestore();
});



