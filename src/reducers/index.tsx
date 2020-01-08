import { ActionCode } from "../constants";
import { StoreState, Token, User } from "../type";
import { combineReducers } from "redux";
import { ReduxAction } from "../actions";
import { default as layout } from "./layout";

function language(langCode = "en", action: ReduxAction<string>): string {
    if (action.type === ActionCode.changeLang) {
        return action.payload as string;
    } else {
        return langCode;
    }
}

function tokenReducer(token: Token = { userId: 0 }, action: ReduxAction<Token>): Token {
    switch (action.type) {
        case ActionCode.grantToken:
            return action.payload as Token;
        case ActionCode.logout:
        case ActionCode.clearToken:
            return { userId: 0 };
        default:
            return token;
    }
}

function verifyToken(verify = false, action: ReduxAction<Token>): boolean {
    switch (action.type) {
        case ActionCode.grantToken:
            return false;
        case ActionCode.logout:
        case ActionCode.clearToken:
            return true;
        default:
            return verify;
    }
}

function user(user: User = { id: 0, code: "", name: "", email: "", avatar: 0 }, action: ReduxAction<User>): User {
    switch (action.type) {
        case ActionCode.updateUser:
            return action.payload;
        case ActionCode.logout:
        case ActionCode.clearToken:
            return { id: 0, code: "", name: "", email: "", avatar: 0 };
        default:
            return user;
    }
}

export default combineReducers<StoreState>({
    language: language,
    token: tokenReducer,
    verifyToken: verifyToken,
    layout,
    user,
});
