import Cookies from "js-cookie";
import { CookieKeys, Storage, ErrCode, WsPath } from "../constants";
import { clearToken } from "../actions";
import { WsError } from "../errors";
import { Ajax, AjaxCfg } from "../ajax";

/* eslint-disable, @typescript-eslint/no-explicit-any */
// const basicAuthKey = process.env.REACT_APP_OAUTH_KEY;

export function getAccessToken(): string | undefined {
    return Cookies.get(CookieKeys.accessToken);
}

export function getAuthorizeToken(): string {
    return `${Cookies.get(CookieKeys.tokenType)} ${getAccessToken()}`;
}

function getRefreshToken(): string | null {
    return localStorage.getItem(Storage.RefreshToken);
}

function getTokenExpired(): string | null {
    return localStorage.getItem(Storage.TokenExpired);
}

/*function getUserID(): string | null {
    return localStorage.getItem(Storage.UserID);
}*/

interface TokenData {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in?: number;
    user_id: string;
}

function setToken(data: TokenData): void {
    Cookies.set(CookieKeys.accessToken, data.access_token);
    Cookies.set(CookieKeys.tokenType, data.token_type);
    if (data.refresh_token) {
        localStorage.setItem(Storage.RefreshToken, data.refresh_token);
    }
    if (data.expires_in) {
        localStorage.setItem(Storage.TokenExpired, (new Date().getTime() + data.expires_in * 1000).toString());
    }
    localStorage.setItem(Storage.UserID, data.user_id);
    // return data;
}

function getTokenData(): TokenData {
    return {
        access_token: Cookies.get(CookieKeys.accessToken) || "",
        token_type: Cookies.get(CookieKeys.tokenType) || "",
        refresh_token: localStorage.getItem(Storage.RefreshToken) || "",
        user_id: localStorage.getItem(Storage.UserID) || "",
    };
}

function removeToken(): void {
    Cookies.remove(CookieKeys.accessToken);
    Cookies.remove(CookieKeys.tokenType);
    localStorage.removeItem(Storage.RefreshToken);
    localStorage.removeItem(Storage.TokenExpired);
    localStorage.removeItem(Storage.UserID);
    /*    if (error) {
        return Promise.reject(error);
    }*/
}

export function isAuthorized(): boolean {
    const key = getAccessToken();
    return !!(key && key.length > 0);
}

export function isTokenValid(): boolean {
    const expiredValue = getTokenExpired();
    if (expiredValue && expiredValue.length > 0) {
        const expiredTime = Number(expiredValue);
        return new Date().getTime() < expiredTime;
    }
    return false;
}

export function isTokenExpiring(duration?: number): boolean {
    if (duration === undefined || duration <= 0) {
        duration = 60 * 1000;
    }
    const expiredValue = getTokenExpired();
    if (expiredValue && expiredValue.length > 0) {
        const expiredTime = Number(expiredValue);
        return expiredTime - new Date().getTime() <= duration;
    }

    return true;
}

let refreshLock = false;

async function waitRefreshToken(): Promise<TokenData> {
    while (refreshLock) {
        await new Promise((resolve): unknown => setTimeout(resolve, 50));
    }

    if (isTokenValid()) {
        return getTokenData();
    }

    throw new WsError(ErrCode.Unauthorized, `You should grant authorized first`);
}

export function invalidateToken(): void {
    removeToken();
    window.store.dispatch(clearToken());
}

export async function refreshToken(): Promise<TokenData> {
    const key = getRefreshToken();
    if (key && key.length > 0) {
        if (refreshLock) {
            return await waitRefreshToken();
        }
        refreshLock = true;
        // todo send refresh ajax
        try {
            const resp = await Ajax.post(
                WsPath.token,
                {
                    // access_token: getAccessToken(),
                    grant_type: "refresh_token",
                    scope: "*",
                    refresh_token: key,
                },
                {
                    ...AjaxCfg.FormRequestConfig,
                    // headers: { Authorization: basicAuthKey },
                    withAuthInject: false,
                }
            );
            setToken(resp.data as TokenData);
            refreshLock = false;
            return resp.data as TokenData;
        } catch (e) {
            refreshLock = false;
            removeToken();
            throw e;
        }
    } else {
        throw new WsError(ErrCode.Unauthorized, `You should grant authorized first`);
    }
}

export async function loginWithPassword(formData: Record<string, unknown>): Promise<TokenData> {
    const { username, password } = formData;
    if (!username || !password) {
        throw new Error("No Username Or Password");
    } else if ((username as string).length === 0 || (password as string).length === 0) {
        throw new Error("Empty Username Or Password");
    }
    const requestData = {
        ...formData,
    };
    const ajaxConfig = {
        ...AjaxCfg.FormRequestConfig,
        // headers: { Authorization: basicAuthKey },
        withAuthInject: false,
    };

    const resp = await Ajax.post(WsPath.login, requestData, ajaxConfig);
    setToken(resp.data as TokenData);
    return resp.data as TokenData;
}

export async function logout(): Promise<boolean> {
    await Ajax.post(WsPath.logout, { token: getAccessToken() }, AjaxCfg.FormRequestConfig);
    removeToken();
    return true;
}

export const Authkit = {
    checkAuthorizeBeforeRequest: (): Promise<void> => checkAuthorizeBeforeRequest(),
    getAuthorizeToken: (): string => getAuthorizeToken(),
};

export async function checkAuthorizeBeforeRequest(): Promise<void> {
    if (isAuthorized()) {
        // if (!isTokenValid()) {
        if (isTokenExpiring()) {
            try {
                await refreshToken();
                // setToken(token);
            } catch (e) {
                // removeToken();
                window.store.dispatch(clearToken());
                throw e;
            }
        }
    } else {
        throw new WsError(ErrCode.Unauthorized, `You should grant authorized first`);
    }
}

/* eslint-enable */
