import { call, put, takeLatest } from "redux-saga/effects";
import { authActions } from "./authSlice";
import type { User } from "./authSlice";
import { getToken, setToken, clearToken } from "../../shared/auth/token";
import { http, setAuthToken } from "../../shared/api/http";
import { getApiBaseUrl } from '../../shared/config/backend'
import { END } from "redux-saga";
import { uiActions } from "../../features/ui/uiSlice";
import { loginMessages } from "../../features/ui/toastMessages";

const ENDPOINTS = {
    me: `${getApiBaseUrl()}/api/me`,
    login: `${getApiBaseUrl()}/api/auth/login`,
    logout: `${getApiBaseUrl()}/api/auth/logout`,
};

function* bootWorker() {
    const token: string | null = yield call(() => getToken());

    if (!token) {
        yield put(authActions.bootFailed());
        return;
    }

    try {
        const user: User = yield call(() => http.get(ENDPOINTS.me).then(r => r.data));
        yield (put(authActions.bootSucceeded({ user, token })));
    } catch (err) {
        clearToken();
        yield (put(authActions.bootFailed()));
    }
}

function* loginWorker(action: ReturnType<typeof authActions.loginRequested>) {
    try {
        const { token, user }: { token: string, user: User } = yield call(() =>
            http.post(ENDPOINTS.login, action.payload).then(r => r.data));
        yield call(() => setToken(token));
        yield call(() => setAuthToken(token));
        yield put(authActions.loginSucceeded({ user, token }))
        yield put(uiActions.toastAdded({ kind: 'success', message: loginMessages.loggedIn }))
    } catch (err) {
        yield call(() => clearToken())
        yield call(() => setAuthToken(null));
        yield put(authActions.loginFailed({ error: 'Login Failed' }))
    }

}

function* logoutWorker() {
    yield call(() => clearToken());
    yield call(() => setAuthToken(null));
    yield put(authActions.logoutSucceeded());
    yield put(uiActions.toastAdded({ kind: 'success', message: loginMessages.loggedOut }))
}

export function* authSaga() {
    yield takeLatest(authActions.bootRequested.type, bootWorker);
    yield takeLatest(authActions.loginRequested.type, loginWorker);
    yield takeLatest(authActions.logoutRequested.type, logoutWorker);
}
