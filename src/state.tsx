import { StoreState } from "./type";
import { url } from "./utilities";
import { Param, Storage } from "./constants";
import reducer from "./reducers";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import { AjaxInstance } from "./ajax";
import { clearToken } from "./actions";

const middleware = [thunk];

const store = createStore(reducer, getInitState(), applyMiddleware(...middleware));

const ajaxErrorHandler = function (err: { status: number }) {
    if (err.status === 401) {
        store.dispatch(clearToken());
    }
    return Promise.reject(err);
};

AjaxInstance.interceptors.response.use(undefined, ajaxErrorHandler);
AjaxInstance.interceptors.request.use(undefined, ajaxErrorHandler);

function getInitState(): StoreState {
    return {
        language: getLang(),
        verifyToken: true,
        layout: {
            theme: "light",
            collapsed: false,
            sideWidth: 300,
            appLoading: {
                status: true,
                tip: "Loading",
            },
            viewLoading: {
                status: false,
            },
        },
        token: {
            userId: 0,
        },
    };
}

function getLang(): string {
    const queryParam = url.getQueryVariable();
    let lang = queryParam[Param.lang] as string | null;
    if (!lang || lang.length === 0) {
        lang = localStorage.getItem(Storage.Lang);
    }

    if (!lang || lang.length === 0) {
        lang = "en";
    }
    return lang;
}

export default store;
