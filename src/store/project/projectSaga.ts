import { call, put, takeLatest } from "redux-saga/effects";
import { getApiBaseUrl } from '../../shared/config/backend'
import { END } from "redux-saga";
import { projectActions } from "./projectSlice";
import { uiActions } from "../../features/ui/uiSlice";
import { http } from "../../shared/api/http";
import type { Project } from "./projectSlice";

function* loadProjects(action: ReturnType<typeof projectActions.requestProjectLoad>) {
    try {
        const base = getApiBaseUrl();
        console.log(base)
        const projects: Project[] = yield call(() => http.get(`${base}/api/projects`, {
            params: { user_id: action.payload.user.id },
        }).then(res => res.data));
        yield put(projectActions.loadProjects({ projects }));
    } catch (err) {
        yield put(uiActions.toastAdded({ kind: 'error', message: 'Error loading projects!' }));
    }
}

export function* projectSaga() {
    yield takeLatest(projectActions.requestProjectLoad.type, loadProjects);
}