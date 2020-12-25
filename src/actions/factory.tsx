/* eslint-disable @typescript-eslint/no-explicit-any */

import { Action } from "redux";

export interface ReduxAction<P> extends Action<string> {
    payload: P;
}

export interface ReduxActionFunction<P> {
    (p?: P): ReduxAction<P>;
}

export function createAction<P>(type: string, payloadCreator?: (data: any) => P): ReduxActionFunction<P> {
    return function (data?: any): ReduxAction<P> {
        let payload: P;
        if (payloadCreator !== null && payloadCreator !== undefined) {
            payload = payloadCreator(data);
        } else {
            payload = data as P;
        }
        return {
            type: type,
            payload: payload,
        };
    };
}
