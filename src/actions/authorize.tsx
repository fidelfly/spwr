import { ActionCode } from "../constants";
import { createAction } from "./factory";
import { Token } from "../type";

export const grantToken = createAction<Token>(ActionCode.grantToken);

export const clearToken = createAction<void>(ActionCode.clearToken);

export const logout = createAction<void>(ActionCode.logout);
