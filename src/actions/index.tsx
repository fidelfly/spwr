import { createAction } from "./factory";
import { ActionCode } from "../constants";
import { User } from "../type";
export * from "./factory";
export * from "./authorize";
export * from "./thunks";
export * from "./layout";

export const changeLang = createAction<string>(ActionCode.changeLang);

export const updateUser = createAction<User>(ActionCode.updateUser);
