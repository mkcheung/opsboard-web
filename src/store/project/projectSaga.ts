import { call, put, takeLatest } from "redux-saga/effects";
import { getApiBaseUrl } from '../../shared/config/backend'
import { END } from "redux-saga";
import { projectActions } from "./projectSlice";
import { uiActions } from "../../features/ui/uiSlice";
import { http } from "../../shared/api/http";
import type { Project } from "../../pages/Projects/projectTypes";

function* loadProjects(action: ReturnType<typeof projectActions.requestProjectLoad>) {
    try {
        const projects: Project[] = yield call(() => http.get(`${getApiBaseUrl()}/api/projects/`).then(res => res.data.data.data));
        yield put(projectActions.loadProjects({ projects }));
    } catch (err) {
        yield put(uiActions.toastAdded({ kind: 'error', message: 'Error loading projects!' }));
    }
}

function* deleteProject(action: ReturnType<typeof projectActions.requestDeleteProject>) {
    try {
        yield call(() => http.delete(`${getApiBaseUrl()}/api/projects/${action.payload.project.id}/`).then(res => res.data));
        yield put(uiActions.toastAdded({ kind: 'success', message: 'Project Deleted.' }));
        yield put(projectActions.requestProjectLoad());
    } catch (err) {
        yield put(uiActions.toastAdded({ kind: 'error', message: 'Error deleting project' }));
    }
}

export function* projectSaga() {
    yield takeLatest(projectActions.requestProjectLoad.type, loadProjects);
    yield takeLatest(projectActions.requestDeleteProject.type, deleteProject);
}