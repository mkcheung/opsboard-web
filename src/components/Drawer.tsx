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
            requestAnimationFrame(() => setVisible(true));
            return;
        }

        setVisible(false);
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

    // Scroll lock (recommended)
    useEffect(() => {
        if (!mounted) return;

        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [mounted]);

    if (!mounted) return null;

    return (
        <div
            role="presentation"
            onMouseDown={() => closeOnBackdrop && onClose()}
            className={`drawerRoot ${visible ? "drawerRootOpen" : "drawerRootClosed"}`}
            style={{ ["--drawer-duration" as any]: `${DURATION_MS}ms` }}
        >
            <aside
                role="dialog"
                aria-modal="true"
                aria-label={title ?? "Drawer"}
                onMouseDown={(e) => e.stopPropagation()}
                className={`drawerPanel ${visible ? "drawerPanelOpen" : "drawerPanelClosed"}`}
                style={{ ["--drawer-width" as any]: `min(${widthPx}px, 92vw)` }}
            >
                <div className="drawerHeader">
                    <h2 className="drawerTitle">{title}</h2>
                    <div style={{ flex: 1 }} />
                    <button onClick={onClose} aria-label="Close drawer" className="btn btnGhost iconBtn">
                        ✕
                    </button>
                </div>

                <div className="drawerBody">{children}</div>
            </aside>
        </div>
    );
}
