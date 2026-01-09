import { call, put, takeLatest } from "redux-saga/effects";
import { getApiBaseUrl } from '../../shared/config/backend'
import { taskActions } from "./taskSlice";
import { uiActions } from "../../features/ui/uiSlice";
import { extractDataByPlatform } from "../../shared/api/extractDataByPlatform";
import { http } from "../../shared/api/http";
import type { Task } from "../../pages/Task/taskTypes";

function* addTask(action: ReturnType<typeof taskActions.requestTaskAdd>) {
    try {
        yield call(() => http.post(`${getApiBaseUrl()}/api/tasks/`, action.payload).then(res => {
            return extractDataByPlatform<Task>(res.data);
        }));
        yield put(uiActions.toastAdded({ kind: 'success', message: 'Task created.' }));
    } catch (err) {
        yield put(uiActions.toastAdded({ kind: 'error', message: 'Error creating task!' }));
    }
}

function* updateTask(action: ReturnType<typeof taskActions.requestTaskUpdate>) {
    try {
        yield call(() => http.put(`${getApiBaseUrl()}/api/tasks/${action.payload.id}/`, action.payload).then(res => {
            return extractDataByPlatform<Task>(res.data);
        }));
        yield put(taskActions.requestLoadProjectTasks({ project_id: +action.payload.project_id }));
        yield put(uiActions.toastAdded({ kind: 'success', message: 'Task updated.' }));
    } catch (err) {
        yield put(uiActions.toastAdded({ kind: 'error', message: 'Error updating task!' }));
    }
}

function* deleteTask(action: ReturnType<typeof taskActions.requestTaskDelete>) {
    try {
        yield call(() => http.delete(`${getApiBaseUrl()}/api/tasks/${action.payload.id}/`));
        yield put(taskActions.requestLoadProjectTasks({ project_id: +action.payload.project_id }));
        yield put(uiActions.toastAdded({ kind: 'success', message: 'Task deleted!' }));
    } catch (err) {
        yield put(uiActions.toastAdded({ kind: 'error', message: 'Error deleting task!' }));
    }
}

function* getProjectTasks(action: ReturnType<typeof taskActions.requestLoadProjectTasks>) {
    try {
        const tasks: Task[] = yield call(() => http.get(`${getApiBaseUrl()}/api/tasks/getProjectRelatedTasks/${action.payload.project_id}/`).then(res => Array.isArray(res.data) ? res.data : res.data.data));
        yield put(taskActions.populateProjectTasks({ tasks }));
    } catch (err) {
        yield put(uiActions.toastAdded({ kind: 'error', message: 'Error loading project tasks!' }));
    }

}

export function* taskSaga() {
    yield takeLatest(taskActions.requestTaskAdd.type, addTask);
    yield takeLatest(taskActions.requestTaskUpdate.type, updateTask);
    yield takeLatest(taskActions.requestTaskDelete.type, deleteTask);
    yield takeLatest(taskActions.requestLoadProjectTasks.type, getProjectTasks)
}