import { Action } from "../constants";
import { Token } from "../type";
import { combineReducers } from "redux";
import { ReduxAction } from "../actions";

function language(langCode = "en", action: ReduxAction<string>): string {
    if (action.type === Action.CHANGE_LANG) {
        return action.payload as string;
    } else {
        return langCode;
    }
}

function tokenReducer(token: Token = { userId: 0 }, action: ReduxAction<Token>): Token {
    switch (action.type) {
        case Action.GRANT_TOKEN:
            return action.payload as Token;
        case Action.LOGOUT:
        case Action.CLEAR_TOKEN:
            return { userId: 0 };
        default:
            return token;
    }
}

function verifyToken(verify = false, action: ReduxAction<Token>): boolean {
    switch (action.type) {
        case Action.GRANT_TOKEN:
            return false;
        case Action.LOGOUT:
        case Action.CLEAR_TOKEN:
            return true;
        default:
            return verify;
    }
}

export default combineReducers({
    language: language,
    token: tokenReducer,
    verifyToken: verifyToken,
});
