import { useEffect, useState } from "react";

type DrawerProps = {
    open: boolean;
    title?: string;
    onClose: () => void;
    children: React.ReactNode;
    widthPx?: number;
    closeOnBackdrop?: boolean;
    closeOnEscape?: boolean;
};

export function Drawer({
    open,
    title,
    onClose,
    children,
    widthPx = 520,
    closeOnBackdrop = true,
    closeOnEscape = true,
}: DrawerProps) {
    const DURATION_MS = 180;

    // Keep mounted long enough to play exit animation
    const [mounted, setMounted] = useState(open);
    const [visible, setVisible] = useState(open);

    useEffect(() => {
        if (open) {
            setMounted(true);
            // next tick so transition runs
            requestAnimationFrame(() => setVisible(true));
            return;
        }

        // start exit animation
        setVisible(false);

        // unmount after transition completes
        const t = window.setTimeout(() => setMounted(false), DURATION_MS);
        return () => window.clearTimeout(t);
    }, [open]);

    // Escape key
    useEffect(() => {
        if (!mounted || !closeOnEscape) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [mounted, closeOnEscape, onClose]);

    if (!mounted) return null;

    return (
        <div
            role="presentation"
            onMouseDown={() => closeOnBackdrop && onClose()}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,

                // Backdrop fade
                background: visible ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0)",
                transition: `background ${DURATION_MS}ms ease-out`,
            }}
        >
            <aside
                role="dialog"
                aria-modal="true"
                aria-label={title ?? "Drawer"}
                onMouseDown={(e) => e.stopPropagation()}
                style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    height: "100%",
                    width: `min(${widthPx}px, 92vw)`,
                    background: "#fff",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                    display: "flex",
                    flexDirection: "column",

                    // Slide in/out
                    transform: visible ? "translateX(0)" : "translateX(16px)",
                    opacity: visible ? 1 : 0,
                    transition: `transform ${DURATION_MS}ms ease-out, opacity ${DURATION_MS}ms ease-out`,
                }}
            >
                {/* Header */}
                <div
                    style={{
                        padding: 16,
                        borderBottom: "1px solid #eee",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                    }}
                >
                    <h2 style={{ margin: 0, fontSize: 18 }}>{title}</h2>
                    <div style={{ flex: 1 }} />
                    <button
                        onClick={onClose}
                        aria-label="Close drawer"
                        style={{
                            border: "1px solid #ddd",
                            background: "#fff",
                            borderRadius: 8,
                            padding: "6px 10px",
                            cursor: "pointer",
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: 16, overflow: "auto" }}>{children}</div>
            </aside>
        </div>
    );
}
