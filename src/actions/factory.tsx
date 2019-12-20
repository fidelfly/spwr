/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ReduxAction<P> {
    type: string;
    payload?: P;
}

export interface ReduxActionFunction<P> {
    (p?: P): ReduxAction<P>;
}

export function createAction<P>(type: string, payloadCreator?: (data: any) => P): ReduxActionFunction<P> {
    return function(data?: any): ReduxAction<P> {
        const action: ReduxAction<P> = {
            type: type,
            // payload: p ,
        };
        if (payloadCreator !== null && payloadCreator !== undefined) {
            action.payload = payloadCreator(data);
        } else {
            action.payload = data as P;
        }
        return action;
    };
}
