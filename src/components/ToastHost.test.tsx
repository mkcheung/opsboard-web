import { expect, vi } from 'vitest';
import {
    render,
    screen
} from "@testing-library/react";
import { ToastHost } from './ToastHost';
import { uiActions } from '../features/ui/uiSlice';
import userEvent from '@testing-library/user-event';

let selectorFunct = {
    ui: {
        toasts: [{
            id: '1',
            kind: 'success',
            message: 'Test Message',
            createdAt: Date.now(),
            duration: 2500
        }]
    }
};
const dispatchMock = vi.fn();

vi.mock('../store/hooks/hooks', () => ({
    useAppDispatch: () => dispatchMock,
    useAppSelector: (selector: any) => selector(selectorFunct),
}));

describe('ToastHost tests', () => {
    beforeEach(() => {
        dispatchMock.mockClear();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("test appearance of toast", async () => {

        vi.useFakeTimers();
        render(<ToastHost />);
        expect(screen.getByText("Test Message")).toBeInTheDocument();
        vi.advanceTimersByTime(2500);
        expect(dispatchMock).toHaveBeenCalledWith(
            uiActions.toastRemoved({ id: selectorFunct.ui.toasts[0].id })
        );
    });

    it("test appearance of toast and user close", async () => {
        vi.useFakeTimers();
        render(<ToastHost />);
        expect(screen.getByText("Test Message")).toBeInTheDocument();
        await userEvent.click(screen.getByRole("button"));
        expect(dispatchMock).toHaveBeenCalledWith(
            uiActions.toastRemoved({ id: selectorFunct.ui.toasts[0].id })
        );
    });

    it("test no toast appearance", async () => {
        selectorFunct = {
            ui: {
                toasts: []
            }
        };
        const { container } = render(<ToastHost />);
        expect(container.firstChild).toBeNull();
        expect(screen.queryByText("Test Message")).toBeNull();
    });
});
