import { all, fork } from "redux-saga/effects";
import { authSaga } from "./auth/authSaga";
import { projectSaga } from "./project/projectSaga";
import { taskSaga } from "./task/taskSaga";

export default function* rootSaga() {
    yield all([
        fork(authSaga),
        fork(projectSaga),
        fork(taskSaga),
    ]);
}