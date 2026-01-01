import { useEffect } from "react";
import {
    useAppDispatch,
    useAppSelector
} from "../hooks/hooks";
import { authActions } from "./authSlice";
import type { RootState } from "../store";

export function AuthBoot({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const status = useAppSelector((s: RootState) => s.auth.status);

    useEffect(() => {
        dispatch(authActions.bootRequested());
    }, [dispatch]);
    if (status === "checking") {
        return <div style={{ padding: 24 }}>Loading...</div>;
    }

    return <>{children}</>;
}