import { createAction, ReduxAction } from "./factory";
import { ActionCode } from "../constants";
import { LoadingIndicator } from "../type";

export const toggleMenu = createAction<void>(ActionCode.toggleMenu);
export const updateTheme = createAction<"dark" | "light">(ActionCode.updateTheme);
export const updateSiderWidth = createAction<number>(ActionCode.updateSiderWidth);

// export const appLoading = createAction<boolean>(ActionCode.appLoading);
// export const viewLoading = createAction<boolean>(ActionCode.viewLoading);

export const appLoading = function (status: boolean, tip?: string): ReduxAction<LoadingIndicator> {
    return {
        type: ActionCode.appLoading,
        payload: {
            status: status,
            tip: tip,
        },
    };
};

export const viewLoading = function (status: boolean, tip?: string): ReduxAction<LoadingIndicator> {
    return {
        type: ActionCode.viewLoading,
        payload: {
            status: status,
            tip: tip,
        },
    };
};
