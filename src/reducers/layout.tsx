import { ReduxAction } from "../actions";
import { ActionCode } from "../constants";
import { combineReducers } from "redux";
import { LoadingIndicator, Theme } from "../type";

function collapsed(collapse = false, action: ReduxAction<void>): boolean {
    if (action.type === ActionCode.toggleMenu) {
        return !collapse;
    } else {
        return collapse;
    }
}

function siderTheme(theme: Theme = "light", action: ReduxAction<Theme>): Theme {
    if (action.type === ActionCode.updateTheme) {
        return action.payload;
    } else {
        return theme;
    }
}

function siderWidth(width = 250, action: ReduxAction<number>): number {
    if (action.type === ActionCode.updateSiderWidth) {
        return action.payload;
    } else {
        return width;
    }
}

function appLoading(
    loading: LoadingIndicator = { status: true },
    action: ReduxAction<LoadingIndicator>
): LoadingIndicator {
    if (action.type === ActionCode.appLoading) {
        if (action.payload.tip == null && !action.payload.status) {
            return { ...action.payload, tip: loading.tip };
        }
        return action.payload;
    } else {
        return loading;
    }
}

function viewLoading(
    loading: LoadingIndicator = { status: false },
    action: ReduxAction<LoadingIndicator>
): LoadingIndicator {
    if (action.type === ActionCode.viewLoading) {
        if (action.payload.tip == null && !action.payload.status) {
            return { ...action.payload, tip: loading.tip };
        }

        return action.payload;
    } else {
        return loading;
    }
}

export default combineReducers({
    collapsed,
    theme: siderTheme,
    sideWidth: siderWidth,
    appLoading,
    viewLoading,
});
