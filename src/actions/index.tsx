import { createAction } from "./factory";
import { Action } from "../constants";
export * from "./factory";
export * from "./authorize";

export const changeLang = createAction<string>(Action.CHANGE_LANG);
