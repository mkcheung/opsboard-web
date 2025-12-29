import { useEffect, useState } from "react";
import { getActiveBackend, type Backend } from "./backend";

export function useActiveBackend(): Backend {
    const [backend, setBackend] = useState<Backend>(() => getActiveBackend());

    useEffect(() => {
        const handler = () => setBackend(getActiveBackend());

        window.addEventListener("opsboard:backend-changed", handler);
        // optional: also respond if another tab changes localStorage
        window.addEventListener("storage", handler);

        return () => {
            window.removeEventListener("opsboard:backend-changed", handler);
            window.removeEventListener("storage", handler);
        };
    }, []);

    return backend;
}