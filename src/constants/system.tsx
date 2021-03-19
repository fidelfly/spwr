import { AjaxKit } from "../ajax";
import { WsPath } from "./wspath";

const routerBase = "/";

export default { routerBase };

export function ImageURL(id?: unknown | null): string | null {
    if (id == null || typeof id !== "number" || id <= 0) {
        return null;
    }

    return AjaxKit.getPath(WsPath.avatar.get, { key: id }, true);
}

export function ImageValue(key: string): number {
    if (key.length == 0) {
        return 0;
    }
    return parseInt(key);
}
