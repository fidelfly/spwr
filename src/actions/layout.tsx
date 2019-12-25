import { createAction } from "./factory";
import { ActionCode } from "../constants";

export const toggleMenu = createAction<void>(ActionCode.toggleMenu);
export const updateTheme = createAction<"dark" | "light">(ActionCode.updateTheme);
export const updateSiderWidth = createAction<number>(ActionCode.updateSiderWidth);
