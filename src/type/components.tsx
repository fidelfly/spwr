import { WrappedComponentProps } from "react-intl";
import { ReduxAction } from "../actions";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { StoreState } from "./store";

export type IntlProps = WrappedComponentProps<"intl">;

export type ThunkResult<R> = ThunkAction<R, StoreState, undefined, ReduxAction<any>>;

export type AsyncDispatch = ThunkDispatch<StoreState, undefined, ReduxAction<any>>;

export interface ReduxProps {
    dispatch: AsyncDispatch;
}
