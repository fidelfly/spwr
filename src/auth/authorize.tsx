import Cookies from "js-cookie";
import { CookieKeys, Storage, ErrCode, WsPath } from "../constants";
import { clearToken } from "../actions";
import { WsError } from "../errors";
import { Ajax, Ajaxkit } from "../ajax";

/* eslint-disable @typescript-eslint/camelcase, @typescript-eslint/no-explicit-any */
const basicAuthKey = process.env.REACT_APP_OAUTH_KEY;

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

let refreshLock = false;

async function waitRefreshToken(): Promise<TokenData> {
    while (refreshLock) {
        await new Promise((resolve): any => setTimeout(resolve, 50));
    }

    if (isTokenValid()) {
        return getTokenData();
    }

    throw new WsError(ErrCode.Unauthorized, `You should grant authorized first`);
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
                    access_token: getAccessToken(),
                    grant_type: "refresh_token",
                    scope: "all",
                    refresh_token: key,
                },
                {
                    headers: { Authorization: basicAuthKey },
                    withAuthInject: false,
                }
            );
            setToken(resp.data);
            refreshLock = false;
            return resp.data;
        } catch (e) {
            refreshLock = false;
            removeToken();
            throw e;
        }
    } else {
        throw new WsError(ErrCode.Unauthorized, `You should grant authorized first`);
    }
}

export async function requestToken(authData: { username: string; password: string }): Promise<TokenData> {
    if (authData.username.length === 0 || authData.password.length === 0) {
        throw new Error("No Username Or Password");
    }
    const requestData = {
        ...authData,
        grant_type: "password",
        scope: "all",
    };
    const ajaxConfig = {
        ...Ajaxkit.FormRequestConfig,
        headers: { Authorization: basicAuthKey },
        withAuthInject: false,
    };

    const resp = await Ajax.post(WsPath.token, requestData, ajaxConfig);
    setToken(resp.data);
    return resp.data;
}

export const Authkit = {
    checkAuthorizeBeforeRequest: (): Promise<void> => checkAuthorizeBeforeRequest(),
    getAuthorizeToken: (): string => getAuthorizeToken(),
};

export async function checkAuthorizeBeforeRequest(): Promise<void> {
    if (isAuthorized()) {
        if (!isTokenValid()) {
            try {
                const token = await refreshToken();
                setToken(token);
            } catch (e) {
                removeToken();
                window.store.dispatch(clearToken());
                throw e;
            }
        }
    }
    throw new WsError(ErrCode.Unauthorized, `You should grant authorized first`);
}

/* eslint-enable @typescript-eslint/camelcase */
