import { useEffect } from "react";
import {
    useAppDispatch,
    useAppSelector
} from "../store/hooks/hooks";
import { uiActions } from "../features/ui/uiSlice";

export const ToastHost = () => {
    const dispatch = useAppDispatch();
    const toasts = useAppSelector((s) => s.ui.toasts);

    useEffect(() => {
        const timers = toasts.map((toast) => {
            const actualDuration = toast.duration ?? (toast.kind === 'error' ? 5000 : 2500);
            return setTimeout(() => {
                dispatch(uiActions.toastRemoved({ id: toast.id }))
            }, actualDuration);
        });

        return () => timers.forEach(clearTimeout);
    }, [toasts, dispatch]);

    if (toasts.length === 0) {
        return null;
    }

    return (
        <div
            style={{
                position: "fixed",
                right: 16,
                top: 16,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                zIndex: 9999,
            }}
            aria-live="polite"
            aria-relevant="additions"
        >
            {toasts.map((t) => (
                <div
                    key={t.id}
                    role="status"
                    style={{
                        minWidth: 240,
                        maxWidth: 360,
                        padding: "10px 12px",
                        borderRadius: 10,
                        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                        background:
                            t.kind === "success"
                                ? "#E8F7EE"
                                : t.kind === "error"
                                    ? "#FDECEC"
                                    : "#EEF4FF",
                        border:
                            t.kind === "success"
                                ? "1px solid #BFE7CF"
                                : t.kind === "error"
                                    ? "1px solid #F5B5B5"
                                    : "1px solid #C8D7FF",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                    }}
                >
                    <div style={{ fontSize: 14, lineHeight: 1.25 }}>{t.message}</div>
                    <button
                        onClick={() => dispatch(uiActions.toastRemoved({ id: t.id }))}
                        aria-label="Dismiss toast"
                        style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            fontSize: 16,
                            lineHeight: 1,
                        }}
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
}