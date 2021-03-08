import { Storage, ErrCode, WsPath } from "../constants";
import { WsError } from "../errors";
import { Ajax, AjaxCfg, AjaxInstance, AjaxMessage, joinBase } from "../ajax";
import { AxiosResponse } from "axios";

/* eslint-disable, @typescript-eslint/no-explicit-any */

/* as we use cookie httponly, we can't get token from js
export function getAccessToken(): string | undefined {
    return Cookies.get(CookieKeys.accessToken);
}
export function getAuthorizeToken(): string {
    return `${Cookies.get(CookieKeys.tokenType)} ${getAccessToken()}`;
}
*/

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
    access_token?: string;
    token_type?: string;
    refresh_token: string;
    expires_in?: number;
    user_id: string;
    request_id?: string;
}

let autoRefresh: ReturnType<typeof setTimeout>;

function setToken(data: TokenData): void {
    const expireDate = new Date();
    expireDate.setMinutes(expireDate.getMinutes() + 35);

    /* use httponly instead to avoid attack
    Cookies.set(CookieKeys.accessToken, data.access_token, { expires: expireDate });
    Cookies.set(CookieKeys.tokenType, data.token_type, { expires: expireDate });

    if (data.request_id) {
        Cookies.set(CookieKeys.requestID, data.request_id, { path: `${ApiBase}/login` });
    } else {
        Cookies.remove(CookieKeys.requestID);
    }
    */
    if (data.refresh_token) {
        localStorage.setItem(Storage.RefreshToken, data.refresh_token);
    }
    /*    if (data.expires_in) {
        localStorage.setItem(Storage.TokenExpired, (new Date().getTime() + data.expires_in * 1000).toString());
    }*/
    localStorage.setItem(Storage.TokenExpired, expireDate.getTime().toString());
    localStorage.setItem(Storage.UserID, data.user_id);

    if (autoRefresh !== undefined) {
        clearTimeout(autoRefresh);
    }

    autoRefresh = setTimeout(() => refreshToken(), 30 * 60 * 1000);
}

function getTokenData(): TokenData {
    return {
        /*access_token: Cookies.get(CookieKeys.accessToken) || "",
        token_type: Cookies.get(CookieKeys.tokenType) || "",
        request_id: Cookies.get(CookieKeys.requestID) || "",*/
        refresh_token: localStorage.getItem(Storage.RefreshToken) || "",
        user_id: localStorage.getItem(Storage.UserID) || "",
    };
}

export function removeToken(): void {
    /*Cookies.remove(CookieKeys.accessToken);
    Cookies.remove(CookieKeys.tokenType);
    Cookies.remove(CookieKeys.requestID);*/
    localStorage.removeItem(Storage.RefreshToken);
    localStorage.removeItem(Storage.TokenExpired);
    localStorage.removeItem(Storage.UserID);

    if (autoRefresh !== undefined) {
        clearTimeout(autoRefresh);
    }
}

export function isAuthorized(): boolean {
    // const key = getAccessToken();
    const key = getRefreshToken();
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

/*
export function invalidateToken(): void {
    removeToken();
    window.store.dispatch(clearToken());
}
*/

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
                { ...AjaxCfg.FormRequestConfig }
            );
            setToken(resp.data as TokenData);
            refreshLock = false;
            return resp.data as TokenData;
        } catch (e) {
            refreshLock = false;
            // all errors have been handled in Ajax.post flow (interceptors), no need to do anything here
            // removeToken();
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

    const resp = await Ajax.post(WsPath.login, formData, { ...AjaxCfg.FormRequestConfig });
    setToken(resp.data as TokenData);
    return resp.data as TokenData;
}

export async function logout(): Promise<boolean> {
    try {
        await Ajax.post(WsPath.logout);
        removeToken();
    } catch (e) {
        console.log(e);
        return false;
    }
    return true;
}

async function refreshTokenIfNeed(): Promise<boolean> {
    if (isAuthorized()) {
        if (isTokenExpiring()) {
            try {
                await refreshToken();
                return true;
            } catch (e) {
                throw e;
            }
        }
    }
    return false;
}

AjaxInstance.interceptors.request.use(async function (config) {
    if (config.url !== joinBase(WsPath.token)) {
        try {
            await refreshTokenIfNeed();
        } catch (e) {
            // this function is used to refresh token if need, no guarantee for the success
            console.log(e);
            return Promise.reject(e);
        }
    }

    return config;
});

AjaxInstance.interceptors.response.use(
    function (resp) {
        return resp;
    },
    async function (err: AxiosResponse) {
        if (err.status === 401 && Ajax.isMessage(err.data)) {
            const msg = err.data as AjaxMessage;
            if (msg.code === ErrCode.TokenExpired) {
                try {
                    await refreshToken();
                    return Ajax.request(err.config);
                } catch (e) {
                    removeToken();
                    // invalidateToken();
                }
            } else if (msg.code === ErrCode.Unauthorized) {
                removeToken();
                // invalidateToken();
            }
        }
        return Promise.reject(err);
    }
);

/* eslint-enable */
