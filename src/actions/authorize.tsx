import { Action } from "../constants";
import { createAction } from "./factory";
import { Token } from "../type";

export const grantToken = createAction<Token>(Action.GRANT_TOKEN);

export const clearToken = createAction<null>(Action.CLEAR_TOKEN);
