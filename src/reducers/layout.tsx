import { ReduxAction } from "../actions";
import { ActionCode } from "../constants";
import { combineReducers } from "redux";
import { Theme } from "../type";

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

export default combineReducers({
    collapsed,
    theme: siderTheme,
    sideWidth: siderWidth,
});
