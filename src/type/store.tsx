export type Theme = "dark" | "light";

export interface LoadingIndicator {
    status: boolean;
    tip?: string;
}
export interface LayoutState {
    theme: Theme;
    collapsed: boolean;
    sideWidth: number;
    appLoading: LoadingIndicator;
    viewLoading: LoadingIndicator;
}

export interface Token {
    userId: number;
}

export interface User {
    id: number;
    code: string;
    name: string;
    email: string;
    avatar: number;
}

export interface StoreState {
    language: string;
    verifyToken: boolean;
    layout: LayoutState;
    token: Token;
    user?: User;
}
